import type { Customer, Signal, TimelineEvent, MonthlyFlow } from '../types';
import { sectorRisks } from './mockSectorData';
import { regionalData } from './mockRegionalData';

const firstNames = ["Rajesh", "Priya", "Amit", "Sneha", "Rahul", "Anjali", "Vikram", "Neha", "Sanjay", "Deepika", "Arun", "Kavita", "Manoj", "Pooja", "Suresh", "Meera", "Vijay", "Sunita", "Rohan", "Tanvi"];
const lastNames = ["Kumar", "Sharma", "Singh", "Patel", "Gupta", "Verma", "Reddy", "Nair", "Iyer", "Joshi", "Choudhary", "Deshmukh", "Kulkarni", "Malhotra", "Kapoor"];
const employers = ["Infosys", "TCS", "Wipro", "Amazon", "Flipkart", "HDFC Bank", "ICICI Bank", "Reliance Industries", "Tata Motors", "Mahindra & Mahindra"];
const sectors = ["IT Services", "Finance/Banking", "Retail", "Manufacturing", "Logistics", "Healthcare"];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateTimeline = (riskLevel: string): TimelineEvent[] => {
    const events: TimelineEvent[] = [
        { date: "2024-11-15", severity: "normal", event: "Normal spending pattern", icon: "CheckCircle" },
    ];

    if (riskLevel === 'critical' || riskLevel === 'high') {
        events.push({ date: "2024-12-05", severity: "early", event: "Salary delayed by 2 days", icon: "AlertCircle" });
        events.push({ date: "2025-01-10", severity: "warning", event: "Utility payment delayed", icon: "Clock" });
        events.push({ date: "2025-02-05", severity: "critical", event: "Salary delay (5 days)", icon: "AlertTriangle" });
    } else if (riskLevel === 'medium') {
        events.push({ date: "2025-01-20", severity: "early", event: "Large ATM withdrawal", icon: "TrendingDown" });
    }

    return events;
};

const generateSignals = (riskLevel: string): Signal[] => {
    const signals: Signal[] = [];
    if (riskLevel === 'critical') {
        signals.push({ type: "salary_delay", severity: "critical", value: "5 days late", detectedDate: "2025-02-10", score: 9.2 });
        signals.push({ type: "savings_drawdown", severity: "critical", value: "78% decrease", detectedDate: "2025-01-28", score: 8.8 });
        signals.push({ type: "lending_app", severity: "critical", value: "8 transactions", detectedDate: "2025-02-14", score: 8.5 });
    } else if (riskLevel === 'high') {
        signals.push({ type: "failed_autodebit", severity: "high", value: "2 attempts", detectedDate: "2025-02-08", score: 7.1 });
        signals.push({ type: "utility_delay", severity: "high", value: "12 days late", detectedDate: "2025-02-12", score: 6.8 });
    } else if (riskLevel === 'medium') {
        signals.push({ type: "discretionary_drop", severity: "medium", value: "35% reduction", detectedDate: "2025-02-01", score: 5.5 });
    }
    return signals;
};

const generateCashFlow = (): MonthlyFlow[] => {
    const months = ["September", "October", "November", "December", "January", "February"];
    return months.map((month, i) => ({
        month,
        income: 45000 - (i === 5 ? 5000 : 0),
        expenses: 38000 + (i * 1000),
        surplus: (45000 - (i === 5 ? 5000 : 0)) - (38000 + (i * 1000)),
        status: (45000 - (i === 5 ? 5000 : 0)) - (38000 + (i * 1000)) < 2000 ? (i === 5 ? 'critical' : 'warning') : 'good'
    }));
};

export const generateMockCustomers = (count: number): Customer[] => {
    const customers: Customer[] = [];

    for (let i = 0; i < count; i++) {
        const riskScore = i < count * 0.1 ? Math.floor(Math.random() * 21) + 80 : // 10% critical
            i < count * 0.3 ? Math.floor(Math.random() * 20) + 60 : // 20% high
                i < count * 0.6 ? Math.floor(Math.random() * 20) + 40 : // 30% medium
                    Math.floor(Math.random() * 40);                       // 40% low

        const riskLevel: 'critical' | 'high' | 'medium' | 'low' =
            riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

        const sector = getRandomItem(sectors);
        const region = getRandomItem(regionalData);
        const sectorRisk = sectorRisks.find(s => s.sector === sector) || sectorRisks[0];

        customers.push({
            id: `CU${100000 + i}`,
            name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
            riskScore,
            riskLevel,
            trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
            accountSince: "2019-01-15",
            employer: getRandomItem(employers),
            sector,
            salary: 45000,
            location: region.region,
            products: [
                { type: 'personal_loan', amount: 500000, emi: 12000 },
                { type: 'credit_card', amount: 200000, outstanding: 50000 },
                { type: 'savings', balance: riskLevel === 'critical' ? 5000 : 40000 }
            ],
            signals: generateSignals(riskLevel),
            eess: {
                sectorRisk: sectorRisk.riskScore,
                sectorName: sector,
                sectorTrend: sectorRisk.reasoning,
                regionalUnemployment: region.unemployment,
                regionName: region.region,
                unemploymentTrend: region.trend,
                macroIndicators: {
                    inflation: 6.1,
                    marketIndex: "NIFTY IT -15%"
                },
                combinedScore: (sectorRisk.riskScore + region.unemployment / 20) / 2,
                riskLevel: sectorRisk.riskScore > 0.6 ? 'high' : 'medium'
            },
            financialMetrics: {
                income: {
                    lastSalaryDate: "2025-02-06",
                    delayDays: riskLevel === 'critical' ? 5 : 0,
                    amountChange: riskLevel === 'critical' ? -2500 : 0,
                    avgSalary: 45000
                },
                spending: {
                    discretionaryDrop: riskLevel === 'critical' ? -42 : 0,
                    utilityDelayDays: riskLevel === 'critical' ? 8 : 0,
                    gamblingSpike: riskLevel === 'critical' ? 220 : 0
                },
                liquidity: {
                    savingsBalance: riskLevel === 'critical' ? 5000 : 40000,
                    savingsChange: riskLevel === 'critical' ? -78 : 0,
                    availableCredit: 150000,
                    atmWithdrawals: riskLevel === 'critical' ? 12 : 2
                },
                cashFlow: generateCashFlow()
            },
            timeline: generateTimeline(riskLevel),
            recommendedInterventions: [
                { rank: 1, type: "Payment Holiday (2 months)", successRate: 78, impact: "high" },
                { rank: 2, type: "Loan Restructuring", successRate: 64, impact: "medium" },
                { rank: 3, type: "Financial Counseling Session", successRate: 71, impact: "medium" }
            ],
            daysToDefault: riskLevel === 'critical' ? 12 : 45
        });
    }

    return customers;
};

export const mockCustomers = generateMockCustomers(100);
