export interface Customer {
    id: string;                    // "CU789456"
    name: string;                  // "Rajesh Kumar"
    riskScore: number;             // 0-100
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    trend: 'up' | 'down' | 'stable'; // Risk trend
    accountSince: string;          // "2019-01-15"
    employer: string;              // "Infosys"
    sector: string;                // "IT Services"
    salary: number;                // 45000
    location: string;              // "Maharashtra"

    // Products
    products: Product[];

    // Signals
    signals: Signal[];

    // EESS data
    eess: EESSData;

    // Financial metrics
    financialMetrics: FinancialMetrics;

    // Timeline
    timeline: TimelineEvent[];

    // Interventions
    recommendedInterventions: Intervention[];

    // Days until predicted default
    daysToDefault: number;
}

export type ProductType = 'personal_loan' | 'credit_card' | 'home_loan' | 'savings';

export interface Product {
    type: ProductType;
    amount?: number;              // Loan amount or credit limit
    emi?: number;                 // EMI amount
    outstanding?: number;         // Outstanding balance
    balance?: number;             // Savings balance
}

export type SignalType = 'salary_delay' | 'savings_drawdown' | 'failed_autodebit' |
    'utility_delay' | 'lending_app' | 'discretionary_drop' | 'cash_hoarding';

export interface Signal {
    type: SignalType;
    severity: 'critical' | 'high' | 'medium' | 'low';
    value: string;                // "5 days late", "78% decrease"
    detectedDate: string;
    score: number;                // Impact on risk score (0-10)
}

export interface EESSData {
    sectorRisk: number;           // 0-1 (e.g., 0.72)
    sectorName: string;           // "IT Services"
    sectorTrend: string;          // "Tech layoffs ↑ 18%"
    regionalUnemployment: number; // 8.3
    regionName: string;           // "Maharashtra"
    unemploymentTrend: string;    // "↑ from 7.1%"
    macroIndicators: {
        inflation: number;          // 6.1
        marketIndex: string;        // "NIFTY IT -15%"
    };
    combinedScore: number;        // 0-1 (0.68)
    riskLevel: 'high' | 'medium' | 'low';
}

export interface FinancialMetrics {
    income: {
        lastSalaryDate: string;
        delayDays: number;
        amountChange: number;       // -2500 (vs average)
        avgSalary: number;
    };
    spending: {
        discretionaryDrop: number;  // -42%
        utilityDelayDays: number;
        gamblingSpike: number;      // +220%
    };
    liquidity: {
        savingsBalance: number;
        savingsChange: number;      // -78%
        availableCredit: number;
        atmWithdrawals: number;     // 6x normal
    };
    cashFlow: MonthlyFlow[];
}

export interface MonthlyFlow {
    month: string;               // "September"
    income: number;
    expenses: number;
    surplus: number;             // Can be negative
    status: 'good' | 'warning' | 'critical';
}

export interface TimelineEvent {
    date: string;                // "2025-01-15"
    severity: 'normal' | 'early' | 'warning' | 'critical';
    event: string;
    icon: string;                // Emoji or icon name
}

export interface Intervention {
    rank: number;
    type: string;                // "Payment Holiday (2 months)"
    successRate: number;         // 78
    impact: 'high' | 'medium' | 'low';
    description?: string;
}

export interface SHAPFeature {
    feature: string;
    impact: number;              // +18 points
}

// Sector risk data
export interface SectorRisk {
    sector: string;
    riskScore: number;           // 0-1
    reasoning: string;
    trend: 'positive' | 'negative' | 'stable';
}

// Regional data
export interface RegionalData {
    region: string;
    unemployment: number;
    trend: string;
}
