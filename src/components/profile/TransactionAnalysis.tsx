import React from 'react';
import type { FinancialMetrics } from '../../types';
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart
} from 'recharts';
import { AlertTriangle, CheckCircle2, ShoppingCart, Home, Coffee, HeartPulse, Smartphone, Coins } from 'lucide-react';
import { cn } from '../../utils/utils';

const ActivityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const TableIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
);

interface TransactionAnalysisProps {
    metrics: FinancialMetrics;
}

const CategoryIcon = ({ category }: { category: string }) => {
    if (category.includes('Groceries')) return <ShoppingCart size={14} />;
    if (category.includes('EMI')) return <Home size={14} />;
    if (category.includes('Discretionary')) return <Coffee size={14} />;
    if (category.includes('Healthcare')) return <HeartPulse size={14} />;
    if (category.includes('Lending')) return <Smartphone size={14} />;
    return <Coins size={14} />;
};

const TransactionAnalysis: React.FC<TransactionAnalysisProps> = ({ metrics }) => {
    const chartData = metrics.cashFlow;

    const categorySpending = [
        { category: 'Essentials (Groceries, utilities)', current: '₹12,000', vsAvg: '-5%', status: 'Normal', color: 'text-green-600' },
        { category: 'EMI/Loan payments', current: '₹12,500', vsAvg: 'On time', status: 'Normal', color: 'text-green-600' },
        { category: 'Discretionary (Dining, etc.)', current: '₹4,800', vsAvg: '-68%', status: 'Alert', color: 'text-orange-600' },
        { category: 'Healthcare', current: '₹5,800', vsAvg: '+45%', status: 'Watch', color: 'text-yellow-600' },
        { category: 'Lending App transfers', current: '₹6,600', vsAvg: '+340%', status: 'Critical', color: 'text-red-600' },
        { category: 'Gambling/Lottery', current: '₹4,800', vsAvg: '+220%', status: 'Critical', color: 'text-red-600' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                            <ActivityIcon />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Monthly Cash Flow</h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            <div className="w-2.5 h-2.5 rounded bg-barclays-blue" />
                            INCOME
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            <div className="w-2.5 h-2.5 rounded bg-gray-200" />
                            EXPENSE
                        </div>
                    </div>
                </div>

                <div className="flex-1 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                                tickFormatter={(value) => `₹${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="income" fill="#00A9CE" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                            <Line type="monotone" dataKey="surplus" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                            <TableIcon />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Spending Categories</h2>
                    </div>
                    <span className="text-[10px] font-bold text-barclays-blue uppercase bg-blue-50 px-2 py-1 rounded">30 Day Trend</span>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-gray-400 font-bold uppercase tracking-widest border-b border-gray-50">
                                <th className="pb-4 font-black">Category</th>
                                <th className="pb-4 font-black">Current</th>
                                <th className="pb-4 font-black">vs Avg</th>
                                <th className="pb-4 font-black">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categorySpending.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                <CategoryIcon category={item.category} />
                                            </div>
                                            <span className="font-bold text-gray-700">{item.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 font-black text-gray-900">{item.current}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            "font-bold",
                                            item.vsAvg.startsWith('+') ? "text-red-500" : item.vsAvg.startsWith('-') ? "text-green-500" : "text-gray-900"
                                        )}>
                                            {item.vsAvg}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-1.5">
                                            {item.status === 'Normal' ? (
                                                <CheckCircle2 size={12} className="text-green-500" />
                                            ) : (
                                                <AlertTriangle size={12} className={item.color.replace('text-', 'text-')} />
                                            )}
                                            <span className={cn("font-black uppercase tracking-tighter", item.color)}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default TransactionAnalysis;
