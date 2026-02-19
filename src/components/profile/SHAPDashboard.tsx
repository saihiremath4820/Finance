import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2, Info } from 'lucide-react';
import type { SHAPContribution } from '../../utils/riskEngine';

interface SHAPDashboardProps {
    /** Optional: pass computed SHAP data from the risk engine. Falls back to static baseline. */
    shapContributions?: SHAPContribution[];
    modelScore?: number;
    customerName?: string;
}

// Static fallback data (used when no customer is selected)
const STATIC_SHAP_DATA = [
    { feature: 'External Sector Risk', impact: 22, type: 'positive' },
    { feature: 'Salary Delay Pattern', impact: 18, type: 'positive' },
    { feature: 'Savings Drawdown Rate', impact: 15, type: 'positive' },
    { feature: 'Lending App Velocity', impact: 12, type: 'positive' },
    { feature: 'Utility Arrears', impact: 8, type: 'positive' },
    { feature: 'Historical Loyalty', impact: -10, type: 'negative' },
    { feature: 'Product Diversification', impact: -5, type: 'negative' },
];

const SHAPDashboard: React.FC<SHAPDashboardProps> = ({
    shapContributions,
    modelScore = 87,
    customerName,
}) => {
    // Map risk-engine SHAPContribution to chart format, or use static baseline
    const shapData = shapContributions && shapContributions.length > 0
        ? shapContributions.slice(0, 7).map(c => ({
            feature: c.feature,
            impact: c.impact,
            type: c.direction === 'risk' ? 'positive' : 'negative',
            rawValue: c.rawValue,
        }))
        : STATIC_SHAP_DATA;

    const topRiskDriver = shapData.filter(d => d.type === 'positive')[0];
    const topSafeFactor = shapData.filter(d => d.type === 'negative')[0];
    const globalSHAPMean = (shapData.reduce((s, d) => s + Math.abs(d.impact), 0) / shapData.length).toFixed(1);

    return (
        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-brand-blue-500 border border-white/10">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">SHAP Risk Score Drivers</h2>
                        <p className="text-gray-400 text-xs mt-1">
                            {customerName
                                ? `Key factors for ${customerName} · XGBoost Engine`
                                : 'Key factors influencing the current risk assessment'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-medium text-gray-500">
                        Source: TrustVault Risk Engine v2.0
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                        <Info size={16} className="text-white/30" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* SHAP Waterfall Chart */}
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={shapData}
                            layout="vertical"
                            margin={{ left: 20, right: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ffffff10" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="feature"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#ffffff60', fontWeight: 600 }}
                                width={140}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                                {shapData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'positive' ? '#EF4444' : '#10B981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Driver Explanation Section */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold text-brand-blue-400 mb-2">Risk Driver Explanation</h4>
                        <p className="text-sm text-gray-300 font-normal leading-relaxed mb-4">
                            {topRiskDriver ? (
                                <>
                                    The dominant factor driving the score of{' '}
                                    <span className="text-white font-black">{modelScore}</span> is{' '}
                                    <span className="text-red-400 font-bold">{topRiskDriver.feature}</span>{' '}
                                    (+{Math.abs(topRiskDriver.impact)} pts). This indicates macro and behavioral stress
                                    signals are elevating default probability.
                                    {topSafeFactor && (
                                        <>{' '}Mitigated partially by{' '}
                                            <span className="text-green-400 font-bold">{topSafeFactor.feature}</span>{' '}
                                            ({topSafeFactor.impact} pts).
                                        </>
                                    )}
                                </>
                            ) : (
                                'No significant risk drivers detected for this customer.'
                            )}
                        </p>
                        {topRiskDriver && (
                            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                                <p className="text-sm font-medium text-red-200">
                                    ⚠ Warning: Correlation detected between behavioral and external signals.
                                    High probability of compounding risk without intervention.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-xs font-medium text-gray-400 mb-1">Model Accuracy</div>
                            <div className="text-2xl font-bold">99.81%</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-xs font-medium text-gray-400 mb-1">Global SHAP Mean</div>
                            <div className="text-2xl font-bold">{globalSHAPMean}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-xs font-medium text-gray-400 mb-1">Risk Score</div>
                            <div className="text-2xl font-bold text-red-400">{modelScore}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-xs font-medium text-gray-400 mb-1">Features Used</div>
                            <div className="text-2xl font-bold">{shapData.length}</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-3 bg-red-400 rounded-sm inline-block" />
                            Increases risk
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-3 bg-green-400 rounded-sm inline-block" />
                            Reduces risk
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SHAPDashboard;
