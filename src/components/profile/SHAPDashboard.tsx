import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BrainCircuit, Info } from 'lucide-react';

const shapData = [
    { feature: 'External Sector Risk', impact: 22, type: 'positive' },
    { feature: 'Salary Delay Pattern', impact: 18, type: 'positive' },
    { feature: 'Savings Drawdown Rate', impact: 15, type: 'positive' },
    { feature: 'Lending App Velocity', impact: 12, type: 'positive' },
    { feature: 'Utility Arrears', impact: 8, type: 'positive' },
    { feature: 'Historical Loyalty', impact: -10, type: 'negative' },
    { feature: 'Product Diversification', impact: -5, type: 'negative' },
];

const SHAPDashboard: React.FC = () => {
    return (
        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-blue-500 border border-white/10">
                        <BrainCircuit className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">AI Model Explainability (SHAP)</h2>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Understanding the 'Why' behind the risk score</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        INCREASES RISK
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        DECREASES RISK
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                        <Info size={16} className="text-white/30" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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

                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-xs font-black text-brand-blue-500 uppercase tracking-widest mb-4">Risk Factor Analysis</h4>
                        <p className="text-sm text-white/70 font-medium leading-relaxed mb-6">
                            The dominant factor driving the score of 87 is <span className="text-red-400 font-bold">External Sector Risk</span> (+22 pts).
                            This indicates that even if the customer's internal metrics were improving, the macro environment would keep them in a high-risk category.
                        </p>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-xs font-bold text-red-200">
                                Warning: Correlation detected between salary delay patterns and sector layoffs. High probability of loss of main income source.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Model Accuracy</div>
                            <div className="text-2xl font-black">98.4%</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Global SHAP Mean</div>
                            <div className="text-2xl font-black">12.5</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SHAPDashboard;
