import type { Customer, Signal, TimelineEvent, MonthlyFlow } from '../types';

const firstNames = ["Amit", "Sneha", "Rahul", "Anjali", "Neha", "Sanjay", "Deepika", "Arun", "Kavita", "Manoj", "Pooja", "Suresh", "Meera", "Vijay", "Sunita", "Rohan", "Tanvi"];
const lastNames = ["Patel", "Gupta", "Verma", "Reddy", "Nair", "Iyer", "Choudhary", "Deshmukh", "Kulkarni", "Malhotra", "Kapoor"];
const employers = ["TCS", "Wipro", "Amazon", "Flipkart", "Reliance Industries", "Mahindra & Mahindra"];
const sectors = ["IT Services", "Finance/Banking", "Retail", "Manufacturing", "Logistics", "Healthcare"];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateTimeline = (riskLevel: string, name?: string): TimelineEvent[] => {
    const events: TimelineEvent[] = [
        { date: "2025-12-15", severity: "normal", event: "Normal spending pattern", icon: "CheckCircle" },
    ];

    if (name?.includes('Rajesh')) {
        return [
            { date: "2026-02-01", severity: "early", event: "Salary delayed 7 days", icon: "AlertCircle" },
            { date: "2026-02-05", severity: "warning", event: "Failed auto-debit (Utilities)", icon: "AlertTriangle" },
            { date: "2026-02-10", severity: "critical", event: "Lending app transaction (₹85k)", icon: "TrendingDown" },
            { date: "2026-02-14", severity: "critical", event: "Savings dropped 68%", icon: "DollarSign" }
        ];
    }

    if (name?.includes('Deepak')) {
        return [
            { date: "2025-05-10", severity: "critical", event: "Risk Score Peaked (89/100)", icon: "AlertTriangle" },
            { date: "2025-05-15", severity: "early", event: "Payment Holiday Accepted", icon: "CheckCircle" },
            { date: "2025-08-01", severity: "normal", event: "Regular EMI Resumed", icon: "CheckCircle" },
            { date: "2026-01-15", severity: "normal", event: "Savings Reached ₹85,000", icon: "TrendingUp" }
        ];
    }

    if (riskLevel === 'critical' || riskLevel === 'high') {
        events.push({ date: "2026-01-05", severity: "early", event: "Salary delayed by 2 days", icon: "AlertCircle" });
        events.push({ date: "2026-02-10", severity: "warning", event: "Utility payment delayed", icon: "Clock" });
    }

    return events;
};

const generateSignals = (riskLevel: string, name?: string): Signal[] => {
    if (name?.includes('Rajesh')) {
        return [
            { type: "salary_delay", severity: "critical", value: "7 days late", detectedDate: "2026-02-08", score: 9.5 },
            { type: "savings_drawdown", severity: "critical", value: "68% drop", detectedDate: "2026-02-12", score: 9.2 },
            { type: "lending_app", severity: "critical", value: "₹85,000 txns", detectedDate: "2026-02-14", score: 8.9 },
            { type: "failed_autodebit", severity: "high", value: "Utilities", detectedDate: "2026-02-05", score: 7.8 },
            { type: "macro_impact", severity: "medium", value: "Tech Layoffs (BLR)", detectedDate: "2026-02-01", score: 6.5 }
        ];
    }
    if (name?.includes('Priya')) {
        return [
            { type: "income_drop", severity: "high", value: "25% (Overtime cut)", detectedDate: "2026-01-20", score: 7.5 },
            { type: "discretionary_drop", severity: "medium", value: "40% reduction", detectedDate: "2026-02-01", score: 6.2 },
            { type: "utility_delay", severity: "medium", value: "2 months late", detectedDate: "2026-02-10", score: 6.8 }
        ];
    }
    if (name?.includes('Mohammed')) {
        return [
            { type: "revenue_drop", severity: "high", value: "35% decrease", detectedDate: "2026-01-15", score: 7.9 },
            { type: "vendor_delay", severity: "medium", value: "Payments delayed", detectedDate: "2026-02-01", score: 6.5 },
            { type: "sector_stress", severity: "high", value: "Food Sector Distress", detectedDate: "2026-02-05", score: 7.2 }
        ];
    }

    const signals: Signal[] = [];
    if (riskLevel === 'critical') {
        signals.push({ type: "salary_delay", severity: "critical", value: "5 days late", detectedDate: "2026-02-10", score: 9.2 });
        signals.push({ type: "savings_drawdown", severity: "critical", value: "78% decrease", detectedDate: "2026-01-28", score: 8.8 });
    } else if (riskLevel === 'high') {
        signals.push({ type: "utility_delay", severity: "high", value: "12 days late", detectedDate: "2026-02-12", score: 6.8 });
    }
    return signals;
};

const generateSimpleCashFlow = (salary: number, isStressed: boolean = false): MonthlyFlow[] => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    return months.map((month, i) => {
        const income = salary;
        let expenses = salary * 0.7; // Healthy baseline

        if (isStressed) {
            // Ramp up expenses or income drop in later months
            if (i > 3) expenses = salary * 1.1; // Deficit
        }

        return {
            month,
            income,
            expenses,
            surplus: income - expenses,
            status: income - expenses < 0 ? 'critical' : 'good'
        };
    });
};

// NEW HELPER FUNCTIONS

const generateAge = (riskLevel: string): number => {
    // Younger people tend to have slightly higher risk due to less stability
    if (riskLevel === 'critical' || riskLevel === 'high') {
        return 25 + Math.floor(Math.random() * 15); // 25-40
    }
    return 30 + Math.floor(Math.random() * 25); // 30-55
};

const generateJobType = (riskLevel: string): 'salaried' | 'self_employed' | 'contract' | 'business_owner' => {
    // Self-employed and contract have higher risk
    if (riskLevel === 'critical' || riskLevel === 'high') {
        return Math.random() > 0.5 ? 'contract' : 'self_employed';
    }
    return Math.random() > 0.7 ? 'self_employed' : 'salaried';
};

const generateEmploymentTenure = (age: number, jobType: string): number => {
    // Older age = longer tenure, salaried = more stable
    const maxTenure = Math.min(age - 22, 20); // Can't work before 22
    if (jobType === 'salaried') {
        return 2 + Math.random() * maxTenure;
    }
    return 0.5 + Math.random() * (maxTenure * 0.6); // Self-employed/contract = less tenure
};

const generateCreditScore = (riskScore: number): number => {
    // Inverse correlation: high risk = low credit score
    // Risk 0-100 -> Credit 900-300
    const baseScore = 900 - (riskScore * 6);
    const variance = (Math.random() - 0.5) * 100; // +/- 50
    return Math.max(300, Math.min(900, Math.round(baseScore + variance)));
};

const generateAssets = (age: number, salary: number, creditScore: number) => {
    const ownsHome = age > 35 && salary > 80000 && creditScore > 650 && Math.random() > 0.4;
    const ownsCar = salary > 50000 && creditScore > 600 && Math.random() > 0.5;
    const investmentValue = creditScore > 700 && salary > 100000 ? Math.floor(salary * (2 + Math.random() * 5)) : undefined;

    return { ownsHome, ownsCar, investmentValue };
};

const generateIncomeStreams = (salary: number, jobType: string) => {
    const primary = salary;
    const secondary = jobType === 'self_employed' || jobType === 'business_owner'
        ? Math.floor(salary * (0.1 + Math.random() * 0.3))
        : undefined;
    const passive = salary > 100000 && Math.random() > 0.6
        ? Math.floor(salary * (0.05 + Math.random() * 0.15))
        : undefined;

    return { primary, secondary, passive };
};

const generateDigitalBehavior = (riskLevel: string, age: number) => {
    // Younger and engaged customers = lower risk
    const baseLogins = age < 40 ? 8 : 4;
    const appLoginFrequency = riskLevel === 'low' || riskLevel === 'medium'
        ? baseLogins + Math.floor(Math.random() * 8)
        : Math.floor(Math.random() * 4);

    const lastLoginDate = "2026-02-" + String(10 + Math.floor(Math.random() * 6)).padStart(2, '0');
    const autoPayEnabled = riskLevel === 'low' || riskLevel === 'medium';
    const statementViewFrequency = appLoginFrequency > 5 ? Math.floor(appLoginFrequency * 0.6) : 1;

    return { appLoginFrequency, lastLoginDate, autoPayEnabled, statementViewFrequency };
};

const calculateFinancialRatios = (products: any[], salary: number, savingsBalance: number) => {
    const totalEMI = products.reduce((sum, p) => sum + (p.emi || 0), 0);
    const totalDebt = products.reduce((sum, p) => sum + (p.outstanding || p.amount || 0), 0);
    const totalCreditLimit = products.filter(p => p.type === 'credit_card').reduce((sum, p) => sum + (p.amount || 0), 0);
    const usedCredit = products.filter(p => p.type === 'credit_card').reduce((sum, p) => sum + (p.outstanding || 0), 0);

    const pti = salary > 0 ? totalEMI / salary : 0;
    const dti = salary > 0 ? totalDebt / (salary * 12) : 0;
    const creditUtilization = totalCreditLimit > 0 ? usedCredit / totalCreditLimit : 0;
    const balanceStressRatio = totalEMI > 0 ? savingsBalance / totalEMI : 10;

    return { pti, dti, creditUtilization, balanceStressRatio };
};

const generateBehavioralMetrics = (riskLevel: string) => {
    const latePaymentsLast6M = riskLevel === 'critical' ? 3 + Math.floor(Math.random() * 3)
        : riskLevel === 'high' ? 1 + Math.floor(Math.random() * 2)
            : Math.floor(Math.random() * 2);

    const missedEMICountLast3M = riskLevel === 'critical' ? 1 + Math.floor(Math.random() * 2)
        : riskLevel === 'high' ? Math.floor(Math.random() * 2)
            : 0;

    const paymentVolatilityScore = riskLevel === 'critical' ? 20 + Math.random() * 30
        : riskLevel === 'high' ? 40 + Math.random() * 30
            : 70 + Math.random() * 30;

    const transactionVolatility = riskLevel === 'critical' ? 0.3 + Math.random() * 0.4
        : riskLevel === 'high' ? 0.2 + Math.random() * 0.3
            : 0.05 + Math.random() * 0.15;

    return { latePaymentsLast6M, missedEMICountLast3M, paymentVolatilityScore, transactionVolatility };
};

export const generateMockCustomers = (count: number): Customer[] => {
    const customers: Customer[] = [];

    // 1. RAJESH KUMAR (HERO)
    const rajeshProducts = [
        { type: 'home_loan' as const, amount: 4500000, emi: 42000, purpose: 'home' as const, startDate: '2018-06-15', maturityDate: '2038-06-15' },
        { type: 'personal_loan' as const, amount: 850000, emi: 18500, purpose: 'personal' as const, startDate: '2024-01-10' },
        { type: 'credit_card' as const, amount: 300000, outstanding: 276000 } // 92% util
    ];
    const rajeshAge = 34;
    const rajeshJobType = 'salaried' as const;
    const rajeshCreditScore = generateCreditScore(87);
    const rajeshSavings = 42000;

    customers.push({
        id: "CU789456",
        name: "Rajesh Kumar",
        riskScore: 87,
        riskLevel: "critical",
        trend: "up", // risk going up
        accountSince: "2020-03-12",
        employer: "Infosys",
        sector: "IT Services",
        salary: 145000, // Monthly in INR
        location: "Bangalore",

        // NEW: Demographics
        age: rajeshAge,
        jobType: rajeshJobType,
        employmentTenure: 6.5,
        maritalStatus: 'married',
        dependents: 2,
        education: 'bachelors',

        // NEW: Credit Profile
        creditScore: rajeshCreditScore,
        creditScoreDate: "2026-01-15",

        // NEW: Assets
        assets: generateAssets(rajeshAge, 145000, rajeshCreditScore),

        // NEW: Income Streams
        incomeStreams: generateIncomeStreams(145000, rajeshJobType),

        // NEW: Digital Behavior
        digitalBehavior: {
            appLoginFrequency: 3,
            lastLoginDate: "2026-02-10",
            autoPayEnabled: false,
            statementViewFrequency: 1
        },

        products: rajeshProducts,
        signals: generateSignals("critical", "Rajesh"),
        eess: {
            sectorRisk: 0.75,
            sectorName: "IT Services",
            sectorTrend: "Layoffs in major tech firms",
            regionalUnemployment: 6.8,
            regionName: "Bangalore",
            unemploymentTrend: "up",
            macroIndicators: { inflation: 6.2, marketIndex: "NIFTY IT -12%" },
            combinedScore: 82,
            riskLevel: "high"
        },
        financialMetrics: {
            income: { lastSalaryDate: "2026-01-31", delayDays: 7, amountChange: 0, avgSalary: 145000 },
            spending: { discretionaryDrop: 0, utilityDelayDays: 5, gamblingSpike: 0 },
            liquidity: { savingsBalance: rajeshSavings, savingsChange: -68, availableCredit: 24000, atmWithdrawals: 5 },
            cashFlow: generateSimpleCashFlow(145000, true),
            ratios: calculateFinancialRatios(rajeshProducts, 145000, rajeshSavings),
            behavioralMetrics: generateBehavioralMetrics("critical")
        },
        timeline: generateTimeline("critical", "Rajesh"),
        recommendedInterventions: [
            { rank: 1, type: "Payment Holiday (3 months)", successRate: 78, impact: "high", valueSaved: "₹4,20,000" },
            { rank: 2, type: "Loan Restructuring", successRate: 65, impact: "medium" },
            { rank: 3, type: "Financial Counseling", successRate: 60, impact: "low" }
        ],
        daysToDefault: 12
    });

    // 2. DEEPAK JOSHI (SUCCESS STORY)
    const deepakProducts = [
        { type: 'home_loan' as const, amount: 2500000, emi: 22000, purpose: 'home' as const, startDate: '2018-06-25', maturityDate: '2038-06-25' }
    ];
    const deepakAge = 38;
    const deepakJobType = 'salaried' as const;
    const deepakCreditScore = generateCreditScore(42);
    const deepakSavings = 85000;

    customers.push({
        id: "CU223344",
        name: "Deepak Joshi",
        riskScore: 42,
        riskLevel: "medium",
        trend: "down", // Recovering
        accountSince: "2018-06-22",
        employer: "Tata Motors",
        sector: "Manufacturing",
        salary: 65000,
        location: "Pune",

        age: deepakAge,
        jobType: deepakJobType,
        employmentTenure: 7.6,
        maritalStatus: 'married',
        dependents: 1,
        education: 'bachelors',

        creditScore: deepakCreditScore,
        creditScoreDate: "2026-01-20",

        assets: generateAssets(deepakAge, 65000, deepakCreditScore),
        incomeStreams: generateIncomeStreams(65000, deepakJobType),
        digitalBehavior: generateDigitalBehavior("medium", deepakAge),

        products: deepakProducts,
        signals: [],
        eess: {
            sectorRisk: 0.4, sectorName: "Manufacturing", sectorTrend: "Stable",
            regionalUnemployment: 5.2, regionName: "Pune", unemploymentTrend: "stable",
            macroIndicators: { inflation: 5.5, marketIndex: "AUTO +2%" }, combinedScore: 40, riskLevel: "low"
        },
        financialMetrics: {
            income: { lastSalaryDate: "2026-02-01", delayDays: 0, amountChange: 0, avgSalary: 65000 },
            spending: { discretionaryDrop: 0, utilityDelayDays: 0, gamblingSpike: 0 },
            liquidity: { savingsBalance: deepakSavings, savingsChange: 15, availableCredit: 100000, atmWithdrawals: 1 },
            cashFlow: generateSimpleCashFlow(65000, false),
            ratios: calculateFinancialRatios(deepakProducts, 65000, deepakSavings),
            behavioralMetrics: generateBehavioralMetrics("medium")
        },
        timeline: generateTimeline("medium", "Deepak"),
        recommendedInterventions: [],
        daysToDefault: 999 // Safe
    });








    // 3. PRIYA SHARMA (EMPATHY)
    const priyaProducts = [
        { type: 'education_loan' as const, amount: 1800000, emi: 25000, purpose: 'education' as const, startDate: '2015-11-15', maturityDate: '2030-11-15' },
        { type: 'car_loan' as const, amount: 650000, emi: 12000, purpose: 'vehicle' as const, startDate: '2023-05-20' }
    ];
    const priyaAge = 41;
    const priyaJobType = 'salaried' as const;
    const priyaCreditScore = generateCreditScore(72);
    const priyaSavings = 12000;

    customers.push({
        id: "CU334455",
        name: "Dr. Priya Sharma",
        riskScore: 72,
        riskLevel: "high",
        trend: "up",
        accountSince: "2015-11-10",
        employer: "Apollo Hospitals",
        sector: "Healthcare",
        salary: 110000,
        location: "Mumbai",

        age: priyaAge,
        jobType: priyaJobType,
        employmentTenure: 10.3,
        maritalStatus: 'single',
        dependents: 0,
        education: 'phd',

        creditScore: priyaCreditScore,
        creditScoreDate: "2026-01-25",

        assets: generateAssets(priyaAge, 110000, priyaCreditScore),
        incomeStreams: generateIncomeStreams(110000, priyaJobType),
        digitalBehavior: generateDigitalBehavior("high", priyaAge),

        products: priyaProducts,
        signals: generateSignals("high", "Priya"),
        eess: {
            sectorRisk: 0.45, sectorName: "Healthcare", sectorTrend: "Operational cuts",
            regionalUnemployment: 5.5, regionName: "Mumbai", unemploymentTrend: "stable",
            macroIndicators: { inflation: 6.5, marketIndex: "PHARMA -2%" }, combinedScore: 65, riskLevel: "medium"
        },
        financialMetrics: {
            income: { lastSalaryDate: "2026-02-01", delayDays: 0, amountChange: -25, avgSalary: 110000 },
            spending: { discretionaryDrop: -40, utilityDelayDays: 60, gamblingSpike: 0 },
            liquidity: { savingsBalance: priyaSavings, savingsChange: -30, availableCredit: 50000, atmWithdrawals: 2 },
            cashFlow: [],
            ratios: calculateFinancialRatios(priyaProducts, 110000, priyaSavings),
            behavioralMetrics: generateBehavioralMetrics("high")
        },
        timeline: generateTimeline("high", "Priya"),
        recommendedInterventions: [
            { rank: 1, type: "Loan Restructuring", successRate: 82, impact: "high", valueSaved: "₹2,80,000" },
            { rank: 2, type: "Counseling", successRate: 60, impact: "medium" }
        ],
        daysToDefault: 25
    });

    // 4. MOHAMMED ISMAIL (BUSINESS)
    const mohammedProducts = [
        { type: 'business_loan' as const, amount: 3200000, emi: 45000, purpose: 'business' as const, startDate: '2019-04-15', maturityDate: '2029-04-15' },
        { type: 'working_capital' as const, amount: 1500000, outstanding: 1400000 }
    ];
    const mohammedAge = 47;
    const mohammedJobType = 'business_owner' as const;
    const mohammedCreditScore = generateCreditScore(76);
    const mohammedSavings = 25000;

    customers.push({
        id: "CU556677",
        name: "Mohammed Ismail",
        riskScore: 76,
        riskLevel: "high",
        trend: "up",
        accountSince: "2010-04-12",
        employer: "Self Employed (Restaurant)",
        sector: "Hospitality",
        salary: 150000, // Business Income
        location: "Hyderabad",

        age: mohammedAge,
        jobType: mohammedJobType,
        employmentTenure: 15.8,
        maritalStatus: 'married',
        dependents: 3,
        education: 'bachelors',

        creditScore: mohammedCreditScore,
        creditScoreDate: "2026-02-01",

        assets: generateAssets(mohammedAge, 150000, mohammedCreditScore),
        incomeStreams: generateIncomeStreams(150000, mohammedJobType),
        digitalBehavior: generateDigitalBehavior("high", mohammedAge),

        products: mohammedProducts,
        signals: generateSignals("high", "Mohammed"),
        eess: {
            sectorRisk: 0.8, sectorName: "Hospitality", sectorTrend: "High input costs",
            regionalUnemployment: 6.0, regionName: "Hyderabad", unemploymentTrend: "up",
            macroIndicators: { inflation: 7.2, marketIndex: "FMCG -5%" }, combinedScore: 78, riskLevel: "high"
        },
        financialMetrics: {
            income: { lastSalaryDate: "2026-02-01", delayDays: 15, amountChange: -35, avgSalary: 150000 },
            spending: { discretionaryDrop: 0, utilityDelayDays: 10, gamblingSpike: 0 },
            liquidity: { savingsBalance: mohammedSavings, savingsChange: -50, availableCredit: 10000, atmWithdrawals: 8 },
            cashFlow: [],
            ratios: calculateFinancialRatios(mohammedProducts, 150000, mohammedSavings),
            behavioralMetrics: generateBehavioralMetrics("high")
        },
        timeline: generateTimeline("high", "Mohammed"),
        recommendedInterventions: [
            { rank: 1, type: "Grace Period + Advisory", successRate: 68, impact: "high", valueSaved: "₹5,80,000" }
        ],
        daysToDefault: 18
    });

    // 5. VIKRAM SINGH (CONTRAST)
    const vikramProducts = [
        { type: 'home_loan' as const, amount: 6500000, emi: 55000, purpose: 'home' as const, startDate: '2014-09-01', maturityDate: '2034-09-01' },
        { type: 'mutual_funds' as const, amount: 1200000, emi: 0 }
    ];
    const vikramAge = 52;
    const vikramJobType = 'salaried' as const;
    const vikramCreditScore = generateCreditScore(18);
    const vikramSavings = 520000;

    customers.push({
        id: "CU998877",
        name: "Vikram Singh",
        riskScore: 18,
        riskLevel: "low",
        trend: "stable",
        accountSince: "2014-08-30",
        employer: "HDFC Bank",
        sector: "Finance/Banking",
        salary: 180000,
        location: "Chandigarh",

        age: vikramAge,
        jobType: vikramJobType,
        employmentTenure: 18.5,
        maritalStatus: 'married',
        dependents: 2,
        education: 'masters',

        creditScore: vikramCreditScore,
        creditScoreDate: "2026-02-05",

        assets: generateAssets(vikramAge, 180000, vikramCreditScore),
        incomeStreams: generateIncomeStreams(180000, vikramJobType),
        digitalBehavior: generateDigitalBehavior("low", vikramAge),

        products: vikramProducts,
        signals: [],
        eess: {
            sectorRisk: 0.2, sectorName: "Finance", sectorTrend: "Stable",
            regionalUnemployment: 4.5, regionName: "Chandigarh", unemploymentTrend: "down",
            macroIndicators: { inflation: 5.0, marketIndex: "BANKNIFTY +1%" }, combinedScore: 20, riskLevel: "low"
        },
        financialMetrics: {
            income: { lastSalaryDate: "2026-01-31", delayDays: 0, amountChange: 5, avgSalary: 180000 },
            spending: { discretionaryDrop: 0, utilityDelayDays: 0, gamblingSpike: 0 },
            liquidity: { savingsBalance: vikramSavings, savingsChange: 10, availableCredit: 400000, atmWithdrawals: 1 },
            cashFlow: [],
            ratios: calculateFinancialRatios(vikramProducts, 180000, vikramSavings),
            behavioralMetrics: generateBehavioralMetrics("low")
        },
        timeline: generateTimeline("low", "Vikram"),
        recommendedInterventions: [],
        daysToDefault: 999
    });


    // Fill rest with random data
    for (let i = 0; i < count - 5; i++) {
        const riskScore = Math.floor(Math.random() * 100);
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        const salary = 40000 + Math.floor(Math.random() * 100000);
        const age = generateAge(riskLevel);
        const jobType = generateJobType(riskLevel);
        const creditScore = generateCreditScore(riskScore);
        const savingsBalance = salary * (0.5 + Math.random() * 2);

        const randomProducts = [{ type: 'personal_loan' as const, amount: 200000, emi: 5000, purpose: 'personal' as const, startDate: '2023-01-15' }];

        customers.push({
            id: `CU${100000 + i}`,
            name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
            riskScore,
            riskLevel,
            trend: Math.random() > 0.5 ? 'up' : 'stable',
            accountSince: "2021-06-15",
            employer: getRandomItem(employers),
            sector: getRandomItem(sectors),
            salary,
            location: "Mumbai",

            age,
            jobType,
            employmentTenure: generateEmploymentTenure(age, jobType),
            maritalStatus: Math.random() > 0.5 ? 'married' : 'single',
            dependents: Math.floor(Math.random() * 3),
            education: getRandomItem(['high_school', 'bachelors', 'masters'] as const),

            creditScore,
            creditScoreDate: "2026-01-15",

            assets: generateAssets(age, salary, creditScore),
            incomeStreams: generateIncomeStreams(salary, jobType),
            digitalBehavior: generateDigitalBehavior(riskLevel, age),

            products: randomProducts,
            signals: generateSignals(riskLevel),
            eess: {
                sectorRisk: 0.5, sectorName: "General", sectorTrend: "Stable",
                regionalUnemployment: 5.0, regionName: "Mumbai", unemploymentTrend: "stable",
                macroIndicators: { inflation: 6.0, marketIndex: "NIFTY Flat" }, combinedScore: 50, riskLevel: "medium"
            },
            financialMetrics: {
                income: { lastSalaryDate: "2026-02-01", delayDays: 0, amountChange: 0, avgSalary: salary },
                spending: { discretionaryDrop: 0, utilityDelayDays: 0, gamblingSpike: 0 },
                liquidity: { savingsBalance, savingsChange: 0, availableCredit: 50000, atmWithdrawals: 2 },
                cashFlow: [],
                ratios: calculateFinancialRatios(randomProducts, salary, savingsBalance),
                behavioralMetrics: generateBehavioralMetrics(riskLevel)
            },
            timeline: generateTimeline(riskLevel),
            recommendedInterventions: [],
            daysToDefault: riskLevel === 'critical' ? 15 : 60
        });
    }

    return customers;
};

export const mockCustomers = generateMockCustomers(100);
