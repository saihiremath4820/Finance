import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Minus, Users, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SignalData {
    type: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
    score: number;
    impact: string;
    sparkline: number[];
}

// Helper to generate SVG path for sparkline
const generateSparklinePath = (data: number[], width: number = 100, height: number = 30) => {
    if (data.length < 2) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    return data.map((val, i) => {
        const x = i * stepX;
        const normalizedY = (val - min) / range;
        const y = height - (normalizedY * height); // Invert Y for SVG
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
};

const signalData: SignalData[] = [
    {
        type: 'Salary Delay',
        count: 234,
        trend: 'up',
        score: 7.8,
        impact: '₹1.2Cr',
        sparkline: [40, 42, 45, 48, 46, 50, 52, 55, 58, 62]
    },
    {
        type: 'Savings Drawdown',
        count: 189,
        trend: 'up',
        score: 8.2,
        impact: '₹85L',
        sparkline: [60, 62, 65, 63, 68, 72, 75, 78, 80, 85]
    },
    {
        type: 'Late Utility Payments',
        count: 156,
        trend: 'stable',
        score: 6.5,
        impact: '₹45L',
        sparkline: [30, 32, 31, 33, 32, 34, 33, 35, 34, 35]
    },
    {
        type: 'Failed Auto-Debits',
        count: 98,
        trend: 'down',
        score: 7.1,
        impact: '₹1.5Cr',
        sparkline: [50, 48, 45, 42, 40, 38, 35, 32, 30, 28]
    },
    {
        type: 'Lending App Activity',
        count: 145,
        trend: 'up',
        score: 8.5,
        impact: '₹2.1Cr',
        sparkline: [20, 25, 30, 35, 40, 45, 50, 60, 70, 85]
    },
    {
        type: 'Reduced Discretionary',
        count: 267,
        trend: 'up',
        score: 6.9,
        impact: '₹67L',
        sparkline: [40, 42, 41, 44, 46, 48, 50, 52, 54, 56]
    },
    {
        type: 'Cash Hoarding',
        count: 123,
        trend: 'stable',
        score: 5.8,
        impact: '₹32L',
        sparkline: [25, 26, 25, 27, 26, 26, 27, 26, 27, 27]
    },
];

const SignalHeatmap: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {signalData.map((signal) => (
                <div key={signal.type} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden">

                    {/* Top Accent Line */}
                    <div className={cn(
                        "absolute top-0 left-0 right-0 h-1",
                        signal.score >= 8 ? "bg-red-500" :
                            signal.score >= 7 ? "bg-brand-orange-500" : "bg-yellow-500"
                    )} />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border",
                                signal.score >= 8 ? "bg-red-50 text-red-600 border-red-100" :
                                    signal.score >= 7 ? "bg-brand-orange-50 text-brand-orange-500 border-brand-orange-100" :
                                        "bg-yellow-50 text-yellow-600 border-yellow-100"
                            )}>
                                {signal.score}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm leading-tight">{signal.type}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Users size={12} className="text-gray-400" />
                                    <span className="text-[11px] text-gray-500 font-semibold">{signal.count} affected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Impact & Sparkline */}
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Risk Exposure</p>
                            <p className="text-lg font-bold text-gray-900">{signal.impact}</p>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="h-8 w-24">
                                <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" className="overflow-visible">
                                    <path
                                        d={generateSparklinePath(signal.sparkline)}
                                        fill="none"
                                        stroke={
                                            signal.trend === 'up' ? '#EF4444' :
                                                signal.trend === 'down' ? '#10B981' : '#6B7280'
                                        }
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold mt-1",
                                signal.trend === 'up' ? "text-red-600" :
                                    signal.trend === 'down' ? "text-green-600" :
                                        "text-gray-500"
                            )}>
                                {signal.trend === 'up' ? <ArrowUpRight size={12} /> :
                                    signal.trend === 'down' ? <ArrowDownLeft size={12} /> :
                                        <Minus size={12} />}
                                <span className="uppercase">{signal.trend}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-[11px] font-bold text-gray-400">AI Confidence: 94%</span>
                        <button className="flex items-center gap-1 text-[11px] font-bold text-brand-blue-500 hover:gap-2 transition-all">
                            Analyze Cohort <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SignalHeatmap;
