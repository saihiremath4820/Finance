import type { SectorRisk } from '../types';

export const sectorRisks: SectorRisk[] = [
    {
        sector: "IT Services",
        riskScore: 0.72,
        reasoning: "Tech layoffs ↑ 18%, NIFTY IT -15%, Hiring freeze",
        trend: "negative"
    },
    {
        sector: "Logistics",
        riskScore: 0.58,
        reasoning: "Oil price volatility, Supply chain disruption",
        trend: "negative"
    },
    {
        sector: "Manufacturing",
        riskScore: 0.45,
        reasoning: "Raw material costs ↑ 12%, Export slowdown",
        trend: "stable"
    },
    {
        sector: "Finance/Banking",
        riskScore: 0.32,
        reasoning: "Stable sector, Regulatory support",
        trend: "positive"
    },
    {
        sector: "Healthcare",
        riskScore: 0.28,
        reasoning: "Growing sector, Government support",
        trend: "positive"
    },
    {
        sector: "Retail",
        riskScore: 0.52,
        reasoning: "Consumer spending down, Competition ↑",
        trend: "negative"
    }
];
