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

    // NEW: Demographics
    age: number;                   // 28, 45, 52
    jobType: 'salaried' | 'self_employed' | 'contract' | 'business_owner';
    employmentTenure: number;      // Years at current employer (2.5, 8.0)
    maritalStatus: 'single' | 'married' | 'divorced';
    dependents: number;            // 0, 1, 2, 3+
    education: 'high_school' | 'bachelors' | 'masters' | 'phd';

    // NEW: Credit Profile
    creditScore: number;           // 300-900 (CIBIL)
    creditScoreDate: string;       // "2026-01-15"

    // NEW: Assets
    assets: Assets;

    // NEW: Income Streams
    incomeStreams: IncomeStreams;

    // NEW: Digital Behavior
    digitalBehavior: DigitalBehavior;

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

export type ProductType = 'personal_loan' | 'credit_card' | 'home_loan' | 'savings' |
    'business_loan' | 'working_capital' | 'education_loan' | 'car_loan' | 'mutual_funds';

export interface Product {
    type: ProductType;
    amount?: number;              // Loan amount or credit limit
    emi?: number;                 // EMI amount
    outstanding?: number;         // Outstanding balance
    balance?: number;             // Savings balance
    // NEW: Loan details
    purpose?: 'home' | 'education' | 'medical' | 'business' | 'personal' | 'vehicle';
    startDate?: string;           // "2020-01-15"
    maturityDate?: string;        // "2030-01-15"
}

export type SignalType = 'salary_delay' | 'savings_drawdown' | 'failed_autodebit' |
    'utility_delay' | 'lending_app' | 'discretionary_drop' | 'cash_hoarding' |
    'income_drop' | 'macro_impact' | 'revenue_drop' | 'vendor_delay' | 'sector_stress';

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
    // NEW: Financial Ratios
    ratios: FinancialRatios;
    // NEW: Behavioral Metrics
    behavioralMetrics: BehavioralMetrics;
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
    valueSaved?: string;         // "₹4,20,000"
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

// NEW INTERFACES

export interface Assets {
    ownsHome: boolean;
    ownsCar: boolean;
    investmentValue?: number;      // Mutual funds, stocks, etc.
}

export interface IncomeStreams {
    primary: number;               // Salary
    secondary?: number;            // Rental, freelance, etc.
    passive?: number;              // Investments, dividends
}

export interface DigitalBehavior {
    appLoginFrequency: number;     // Logins per month
    lastLoginDate: string;         // "2026-02-15"
    autoPayEnabled: boolean;
    statementViewFrequency: number; // Views per month
}

export interface FinancialRatios {
    pti: number;                   // Payment to Income (EMI/Salary)
    dti: number;                   // Debt to Income (TotalDebt/Salary)
    creditUtilization: number;     // UsedCredit/TotalCreditLimit (0-1)
    balanceStressRatio: number;    // SavingsBalance/MonthlyEMI
}

export interface BehavioralMetrics {
    latePaymentsLast6M: number;    // Count: 0, 1, 3
    missedEMICountLast3M: number;  // Count: 0, 1, 2
    paymentVolatilityScore: number; // 0-100 (consistency score)
    transactionVolatility: number;  // Std deviation of monthly spending
}
