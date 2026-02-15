import React from 'react';
import type { FinancialMetrics } from '../../types';
import { ArrowDown, ArrowUp, AlertCircle, Wallet, Info, Zap } from 'lucide-react';

interface SignalBreakdownProps {
    metrics: FinancialMetrics;
}

const SignalBreakdown: React.FC<SignalBreakdownProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Panel 1: Income Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Wallet className="w-5 h-5 text-barclays-blue" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Income Pattern</h2>
                </div>
                <div className="flex-1 space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-500 font-bold uppercase">Salary Status</span>
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase italic">Critical Signal</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-1">{metrics.income.delayDays} Days Late</div>
                        <p className="text-[10px] text-gray-400 font-medium">Usual: 1st of month | Actual: {metrics.income.lastSalaryDate}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Amount Change</span>
                            <span className="font-bold text-red-500 flex items-center gap-0.5">
                                <ArrowDown size={12} /> ₹{Math.abs(metrics.income.amountChange).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Risk Impact</span>
                            <span className="font-black text-red-600">+18 pts</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[80%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel 2: Spending Behavior */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Spending Behavior</h2>
                </div>
                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-orange-800 font-bold uppercase tracking-tighter">Discretionary Drop</span>
                                <span className="text-sm font-black text-orange-600">-{Math.abs(metrics.spending.discretionaryDrop)}%</span>
                            </div>
                            <div className="w-full h-1 bg-orange-200 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-orange-500 w-[65%]" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 font-medium">Utility Avg Delay</span>
                                <span className="font-bold text-orange-600">+{metrics.spending.utilityDelayDays} Days</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 font-medium">High-Risk Spikes</span>
                                <span className="font-bold text-red-600 flex items-center gap-0.5">
                                    <ArrowUp size={12} /> {metrics.spending.gamblingSpike}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        Abnormal Patterns Detected
                    </div>
                </div>
            </div>

            {/* Panel 3: Liquidity Position */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Info className="w-5 h-5 text-red-500" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Liquidity Position</h2>
                </div>
                <div className="flex-1 space-y-6">
                    <div className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-red-800 font-bold uppercase">Savings Change</span>
                            <span className="text-sm font-black text-red-600">{metrics.liquidity.savingsChange}%</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">₹{metrics.liquidity.savingsBalance.toLocaleString()}</div>
                    </div>

                    <div className="space-y-4 px-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Credit Utilization</span>
                            <span className="font-bold text-gray-900">57%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">ATM Frequency</span>
                            <span className="font-bold text-red-500 flex items-center gap-1">
                                {metrics.liquidity.atmWithdrawals}x <span className="text-[10px] font-medium text-gray-400">(Monthly)</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-red-50 rounded-lg">
                            <AlertCircle size={14} className="text-red-500 shrink-0" />
                            <span className="text-[10px] font-bold text-red-700 leading-tight">Detected cash hoarding behavior in last 14 days.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignalBreakdown;
