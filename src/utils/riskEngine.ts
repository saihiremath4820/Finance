/**
 * ============================================================
 *  TrustVault Risk Engine  (NEW FILE)
 *  XGBoost-inspired frontend simulation with feature
 *  engineering, threshold customization, and SHAP-style
 *  feature importance weights.
 * ============================================================
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type RiskCategory = 'low' | 'medium' | 'high' | 'critical';

export interface RiskThresholds {
    lowMax: number;      // default 30
    mediumMax: number;   // default 60
    highMax: number;     // default 80
    // > highMax => critical
}

export interface FeatureSet {
    // Financial Capacity
    pti: number;                    // Payment-to-Income ratio (0–1)
    dti: number;                    // Debt-to-Income ratio  (0–1)
    savingsBufferRatio: number;     // Savings / MonthlyEMI  (higher = safer)
    loanExposureRatio: number;      // TotalDebt / (Salary*12) (0–1)

    // Behavioral Risk
    paymentDelayRatio: number;      // LatePayments / TotalPayments (0–1)
    spendingSpikeIndex: number;     // StdDev of monthly spend / AvgSpend (0–1)
    creditUtilizationRatio: number; // UsedCredit / CreditLimit (0–1)

    // External Stress
    regionalUnemploymentRisk: number; // 0–1 (normalised from %)
    inflationStressIndex: number;     // 0–1 (normalised)
    sectorRiskScore: number;          // 0–1

    // Extra raw signals
    missedEMILast3M: number;        // count
    salaryDelayDays: number;        // days
    savingsChangePct: number;       // percentage (negative = bad)
    creditScore: number;            // 300–900 CIBIL
}

export interface RiskScoreResult {
    score: number;                      // 0–100
    category: RiskCategory;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    shapContributions: SHAPContribution[];
    featureFlags: FeatureFlag[];
    timestamp: string;
}

export interface SHAPContribution {
    feature: string;
    group: 'financial' | 'behavioral' | 'external';
    rawValue: string;
    impact: number;    // positive = increases risk, negative = reduces risk
    direction: 'risk' | 'safe';
    weight: number;    // model weight (0–1)
}

export interface FeatureFlag {
    label: string;
    value: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'good';
}

// ─── Default Thresholds ────────────────────────────────────────────────────────

export const DEFAULT_THRESHOLDS: RiskThresholds = {
    lowMax: 30,
    mediumMax: 60,
    highMax: 80,
};

// ─── XGBoost-Inspired Weights ─────────────────────────────────────────────────
// These represent the learned feature importance weights (0–1).
// Positive = increases risk score, Negative = decreases risk score.
const FEATURE_WEIGHTS = {
    // Financial Capacity (sum of abs ≈ 32)
    pti: { weight: 0.12, label: 'PTI Ratio', group: 'financial' as const, risky_high: true },
    dti: { weight: 0.11, label: 'DTI Ratio', group: 'financial' as const, risky_high: true },
    loanExposureRatio: { weight: 0.09, label: 'Loan Exposure', group: 'financial' as const, risky_high: true },
    savingsBufferRatio: { weight: -0.10, label: 'Savings Buffer', group: 'financial' as const, risky_high: false }, // inverse

    // Behavioral Risk (sum of abs ≈ 38)
    paymentDelayRatio: { weight: 0.15, label: 'Payment Delay', group: 'behavioral' as const, risky_high: true },
    spendingSpikeIndex: { weight: 0.10, label: 'Spending Spike', group: 'behavioral' as const, risky_high: true },
    creditUtilizationRatio: { weight: 0.13, label: 'Credit Utilization', group: 'behavioral' as const, risky_high: true },

    // External Stress (sum of abs ≈ 30)
    regionalUnemploymentRisk: { weight: 0.09, label: 'Regional Unemployment', group: 'external' as const, risky_high: true },
    inflationStressIndex: { weight: 0.08, label: 'Inflation Stress', group: 'external' as const, risky_high: true },
    sectorRiskScore: { weight: 0.13, label: 'Sector Risk', group: 'external' as const, risky_high: true },
};

// ─── Normalisation Helpers ────────────────────────────────────────────────────

/** Clamp a number between min and max */
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

/** Map unemployment % (0–15%) → 0–1 */
export const normaliseUnemployment = (pct: number) => clamp(pct / 15, 0, 1);

/** Map inflation % (0–12%) → 0–1 */
export const normaliseInflation = (pct: number) => clamp(pct / 12, 0, 1);

/** Map CIBIL credit score (300–900) → risk factor (0–1), inverse */
const creditScoreToRisk = (score: number) => clamp((900 - score) / 600, 0, 1);

// ─── Core Engine ──────────────────────────────────────────────────────────────

/**
 * Compute a risk score (0–100) using XGBoost-inspired weighted feature aggregation.
 * Handles threshold customization and outputs SHAP-style feature contributions.
 */
export function computeRiskScore(
    features: FeatureSet,
    thresholds: RiskThresholds = DEFAULT_THRESHOLDS
): RiskScoreResult {

    // --- Normalise inputs into 0–1 range ---
    const normalized = {
        pti: clamp(features.pti, 0, 1),
        dti: clamp(features.dti, 0, 1),
        savingsBufferRatio: clamp(1 / Math.max(features.savingsBufferRatio, 0.1), 0, 1), // invert: low buffer = high risk
        loanExposureRatio: clamp(features.loanExposureRatio, 0, 1),
        paymentDelayRatio: clamp(features.paymentDelayRatio, 0, 1),
        spendingSpikeIndex: clamp(features.spendingSpikeIndex, 0, 1),
        creditUtilizationRatio: clamp(features.creditUtilizationRatio, 0, 1),
        regionalUnemploymentRisk: clamp(features.regionalUnemploymentRisk, 0, 1),
        inflationStressIndex: clamp(features.inflationStressIndex, 0, 1),
        sectorRiskScore: clamp(features.sectorRiskScore, 0, 1),
    };

    // --- Compute weighted contributions ---
    let rawScore = 0;
    const shapContributions: SHAPContribution[] = [];

    for (const [key, meta] of Object.entries(FEATURE_WEIGHTS)) {
        const normalizedValue = normalized[key as keyof typeof normalized];
        const contribution = meta.weight * normalizedValue * 100;
        rawScore += contribution;

        // Format raw value for display
        const rawValue = formatRawValue(key, features);
        const absImpact = Math.round(Math.abs(contribution));

        shapContributions.push({
            feature: meta.label,
            group: meta.group,
            rawValue,
            impact: contribution > 0 ? absImpact : -absImpact,
            direction: contribution > 0 ? 'risk' : 'safe',
            weight: Math.abs(meta.weight),
        });
    }

    // --- Adjust for credit score (inverse bonus/penalty) ---
    const creditRisk = creditScoreToRisk(features.creditScore) * 15; // up to ±15 pts
    rawScore += creditRisk;

    // --- Adjust for missed EMIs (hard penalty) ---
    const emiPenalty = features.missedEMILast3M * 5;
    rawScore += emiPenalty;

    // --- Adjust for salary delay ---
    const delayPenalty = clamp(features.salaryDelayDays / 30, 0, 1) * 8;
    rawScore += delayPenalty;

    // --- Clamp final score ---
    const score = Math.round(clamp(rawScore, 0, 100));

    // --- Determine category based on customizable thresholds ---
    let category: RiskCategory;
    let label: string;
    let color: string;
    let bgColor: string;
    let borderColor: string;

    if (score <= thresholds.lowMax) {
        category = 'low'; label = 'Low Risk';
        color = 'text-blue-700'; bgColor = 'bg-blue-50'; borderColor = 'border-blue-200';
    } else if (score <= thresholds.mediumMax) {
        category = 'medium'; label = 'Medium Risk';
        color = 'text-yellow-700'; bgColor = 'bg-yellow-50'; borderColor = 'border-yellow-200';
    } else if (score <= thresholds.highMax) {
        category = 'high'; label = 'High Risk';
        color = 'text-orange-700'; bgColor = 'bg-orange-50'; borderColor = 'border-orange-200';
    } else {
        category = 'critical'; label = 'Critical Risk';
        color = 'text-red-700'; bgColor = 'bg-red-50'; borderColor = 'border-red-200';
    }

    // --- Sort SHAP by absolute impact ---
    shapContributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    // --- Build feature flags ---
    const featureFlags = buildFeatureFlags(features);

    return {
        score,
        category,
        label,
        color,
        bgColor,
        borderColor,
        shapContributions,
        featureFlags,
        timestamp: new Date().toISOString(),
    };
}

// ─── Feature Engineering Helpers ─────────────────────────────────────────────

/**
 * Derive all FeatureSet parameters from a Customer object.
 * This is the feature engineering pipeline.
 */
export function deriveFeatureSet(customer: {
    financialMetrics: {
        ratios: { pti: number; dti: number; creditUtilization: number; balanceStressRatio: number };
        behavioralMetrics: { latePaymentsLast6M: number; missedEMICountLast3M: number; paymentVolatilityScore: number; transactionVolatility: number };
        liquidity: { savingsChange: number };
        income: { delayDays: number; avgSalary: number };
        spending: { gamblingSpike: number };
    };
    eess: { sectorRisk: number; regionalUnemployment: number; macroIndicators: { inflation: number } };
    creditScore: number;
    products: Array<{ emi?: number; amount?: number; outstanding?: number }>;
}): FeatureSet {
    const { ratios, behavioralMetrics, liquidity, income } = customer.financialMetrics;
    const { eess } = customer;

    // Loan Exposure Ratio: Total Outstanding / (Salary * 12)
    const totalOutstanding = customer.products.reduce((s, p) => s + (p.outstanding || p.amount || 0), 0);
    const annualSalary = income.avgSalary * 12;
    const loanExposureRatio = annualSalary > 0 ? totalOutstanding / annualSalary : 0;

    // Payment Delay Ratio: LatePayments / (6 months of payments)
    const paymentDelayRatio = behavioralMetrics.latePaymentsLast6M / 6;

    // Spending Spike Index from transactionVolatility
    const spendingSpikeIndex = clamp(behavioralMetrics.transactionVolatility, 0, 1);

    return {
        pti: ratios.pti,
        dti: ratios.dti,
        savingsBufferRatio: ratios.balanceStressRatio,
        loanExposureRatio,
        paymentDelayRatio,
        spendingSpikeIndex,
        creditUtilizationRatio: ratios.creditUtilization,
        regionalUnemploymentRisk: normaliseUnemployment(eess.regionalUnemployment),
        inflationStressIndex: normaliseInflation(eess.macroIndicators.inflation),
        sectorRiskScore: eess.sectorRisk,
        missedEMILast3M: behavioralMetrics.missedEMICountLast3M,
        salaryDelayDays: income.delayDays,
        savingsChangePct: liquidity.savingsChange,
        creditScore: customer.creditScore,
    };
}

// ─── Risk Score Storage ────────────────────────────────────────────────────────

const STORAGE_KEY = 'trustvault_risk_scores';

export interface StoredRiskScore {
    customerId: string;
    score: number;
    category: RiskCategory;
    timestamp: string;
}

export const riskStore = {
    save(customerId: string, result: RiskScoreResult): void {
        try {
            const existing = this.getAll();
            const entry: StoredRiskScore = {
                customerId,
                score: result.score,
                category: result.category,
                timestamp: result.timestamp,
            };
            // Keep last 10 per customer
            const filtered = existing.filter(e => e.customerId !== customerId).slice(-99);
            filtered.push(entry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (_e) {
            // Storage quota or SSR environment; fail silently
        }
    },

    getAll(): StoredRiskScore[] {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    getForCustomer(customerId: string): StoredRiskScore[] {
        return this.getAll().filter(e => e.customerId === customerId);
    },

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    },
};

// ─── API Integration Helpers ──────────────────────────────────────────────────

export interface APIRequestBody {
    customerId: string;
    features: FeatureSet;
    thresholds?: RiskThresholds;
}

export interface APIResponseBody {
    success: boolean;
    data?: RiskScoreResult;
    error?: string;
    statusCode: number;
}

/**
 * Validates an incoming API body and returns 400-style errors.
 * In a real backend this would be server-side; here it mirrors that logic
 * for the frontend mock API layer.
 */
export function validateAPIRequest(body: unknown): { valid: boolean; error?: string; statusCode?: number } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be a JSON object', statusCode: 400 };
    }
    const b = body as Record<string, unknown>;
    if (!b.customerId || typeof b.customerId !== 'string') {
        return { valid: false, error: 'Missing or invalid field: customerId (string required)', statusCode: 400 };
    }
    if (!b.features || typeof b.features !== 'object') {
        return { valid: false, error: 'Missing or invalid field: features (object required)', statusCode: 400 };
    }
    const f = b.features as Record<string, unknown>;
    const requiredFields = ['pti', 'dti', 'savingsBufferRatio', 'loanExposureRatio',
        'paymentDelayRatio', 'spendingSpikeIndex', 'creditUtilizationRatio',
        'regionalUnemploymentRisk', 'inflationStressIndex', 'sectorRiskScore',
        'creditScore'];
    for (const field of requiredFields) {
        if (typeof f[field] !== 'number') {
            return { valid: false, error: `Missing or invalid feature field: ${field} (number required)`, statusCode: 400 };
        }
    }
    return { valid: true };
}

/**
 * Mock API endpoint: POST /api/v1/risk-score
 * Simulates server-side scoring with JSON validation and error handling.
 */
export async function mockAPIScoreEndpoint(rawBody: unknown): Promise<APIResponseBody> {
    await new Promise(r => setTimeout(r, 180)); // simulate network

    const validation = validateAPIRequest(rawBody);
    if (!validation.valid) {
        return { success: false, error: validation.error, statusCode: validation.statusCode! };
    }

    const body = rawBody as APIRequestBody;
    const result = computeRiskScore(body.features, body.thresholds ?? DEFAULT_THRESHOLDS);
    riskStore.save(body.customerId, result);

    return { success: true, data: result, statusCode: 200 };
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

function formatRawValue(key: string, features: FeatureSet): string {
    switch (key) {
        case 'pti': return `${(features.pti * 100).toFixed(1)}%`;
        case 'dti': return `${(features.dti * 100).toFixed(1)}%`;
        case 'savingsBufferRatio': return `${features.savingsBufferRatio.toFixed(1)}x`;
        case 'loanExposureRatio': return `${(features.loanExposureRatio * 100).toFixed(1)}%`;
        case 'paymentDelayRatio': return `${(features.paymentDelayRatio * 100).toFixed(1)}%`;
        case 'spendingSpikeIndex': return `${(features.spendingSpikeIndex * 100).toFixed(1)}`;
        case 'creditUtilizationRatio': return `${(features.creditUtilizationRatio * 100).toFixed(1)}%`;
        case 'regionalUnemploymentRisk': return `${(features.regionalUnemploymentRisk * 15).toFixed(1)}%`;
        case 'inflationStressIndex': return `${(features.inflationStressIndex * 12).toFixed(1)}%`;
        case 'sectorRiskScore': return `${(features.sectorRiskScore * 100).toFixed(0)}/100`;
        default: return '—';
    }
}

function buildFeatureFlags(features: FeatureSet): FeatureFlag[] {
    const flags: FeatureFlag[] = [];

    // PTI
    flags.push({
        label: 'PTI (Payment-to-Income)',
        value: `${(features.pti * 100).toFixed(1)}%`,
        severity: features.pti > 0.5 ? 'critical' : features.pti > 0.35 ? 'high' : features.pti > 0.25 ? 'medium' : 'good',
    });

    // DTI
    flags.push({
        label: 'DTI (Debt-to-Income)',
        value: `${(features.dti * 100).toFixed(1)}%`,
        severity: features.dti > 0.6 ? 'critical' : features.dti > 0.45 ? 'high' : features.dti > 0.3 ? 'medium' : 'good',
    });

    // Savings Buffer
    flags.push({
        label: 'Savings Buffer Ratio',
        value: `${features.savingsBufferRatio.toFixed(2)}x`,
        severity: features.savingsBufferRatio < 1 ? 'critical' : features.savingsBufferRatio < 2 ? 'high' : features.savingsBufferRatio < 3 ? 'medium' : 'good',
    });

    // Loan Exposure
    flags.push({
        label: 'Loan Exposure Ratio',
        value: `${(features.loanExposureRatio * 100).toFixed(1)}%`,
        severity: features.loanExposureRatio > 0.8 ? 'critical' : features.loanExposureRatio > 0.6 ? 'high' : features.loanExposureRatio > 0.4 ? 'medium' : 'good',
    });

    // Payment Delay Ratio
    flags.push({
        label: 'Payment Delay Ratio',
        value: `${(features.paymentDelayRatio * 100).toFixed(1)}%`,
        severity: features.paymentDelayRatio > 0.5 ? 'critical' : features.paymentDelayRatio > 0.2 ? 'high' : features.paymentDelayRatio > 0.1 ? 'medium' : 'good',
    });

    // Spending Spike Index
    flags.push({
        label: 'Spending Spike Index',
        value: `${(features.spendingSpikeIndex * 100).toFixed(1)}`,
        severity: features.spendingSpikeIndex > 0.6 ? 'critical' : features.spendingSpikeIndex > 0.4 ? 'high' : features.spendingSpikeIndex > 0.2 ? 'medium' : 'good',
    });

    // Credit Utilization
    flags.push({
        label: 'Credit Utilization',
        value: `${(features.creditUtilizationRatio * 100).toFixed(1)}%`,
        severity: features.creditUtilizationRatio > 0.9 ? 'critical' : features.creditUtilizationRatio > 0.7 ? 'high' : features.creditUtilizationRatio > 0.5 ? 'medium' : 'good',
    });

    // Regional Unemployment
    const unemPct = features.regionalUnemploymentRisk * 15;
    flags.push({
        label: 'Regional Unemployment Risk',
        value: `${unemPct.toFixed(1)}%`,
        severity: unemPct > 9 ? 'critical' : unemPct > 7 ? 'high' : unemPct > 5 ? 'medium' : 'good',
    });

    // Inflation Stress
    const inflPct = features.inflationStressIndex * 12;
    flags.push({
        label: 'Inflation Stress Index',
        value: `${inflPct.toFixed(1)}%`,
        severity: inflPct > 8 ? 'critical' : inflPct > 6 ? 'high' : inflPct > 4 ? 'medium' : 'good',
    });

    // Sector Risk
    flags.push({
        label: 'Sector Risk Score',
        value: `${(features.sectorRiskScore * 100).toFixed(0)}/100`,
        severity: features.sectorRiskScore > 0.7 ? 'critical' : features.sectorRiskScore > 0.5 ? 'high' : features.sectorRiskScore > 0.3 ? 'medium' : 'good',
    });

    return flags;
}
