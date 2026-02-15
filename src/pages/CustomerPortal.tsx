import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    CalendarClock,
    PiggyBank,
    CreditCard,
    ArrowUpRight,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Sparkles,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare,
    Download,
    Pause,
    Banknote,
    ShoppingCart,
    Home,
    Utensils,
    Car,
    Wifi
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Animations ---
const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
};

const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0, opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

// --- Mock Data ---
const paymentHistory = [
    { month: 'Sep 2025', amount: '₹12,500', status: 'on-time', date: 'Sep 5' },
    { month: 'Oct 2025', amount: '₹12,500', status: 'on-time', date: 'Oct 3' },
    { month: 'Nov 2025', amount: '₹12,500', status: 'late', date: 'Nov 18' },
    { month: 'Dec 2025', amount: '₹12,500', status: 'on-time', date: 'Dec 4' },
    { month: 'Jan 2026', amount: '₹12,500', status: 'missed', date: '—' },
    { month: 'Feb 2026', amount: '₹12,500', status: 'upcoming', date: 'Feb 28' },
];

const aiRecommendations = [
    {
        title: 'Pay ₹5,000 before March 1',
        description: 'Making a partial payment now will improve your financial health score by 8 points and avoid late fees.',
        impact: '+8 pts',
        impactColor: 'text-green-600 bg-green-50',
        urgency: 'High',
        urgencyColor: 'bg-red-100 text-red-700',
    },
    {
        title: 'Set up Auto-Pay',
        description: 'Enabling auto-debit will ensure on-time payments and can boost your score by 5 points over 3 months.',
        impact: '+5 pts',
        impactColor: 'text-blue-600 bg-blue-50',
        urgency: 'Medium',
        urgencyColor: 'bg-orange-100 text-orange-700',
    },
    {
        title: 'Reduce dining spend by 15%',
        description: 'Your dining category is 40% above average. Reducing it can free up ₹3,200/month for repayment.',
        impact: '₹3.2k saved',
        impactColor: 'text-purple-600 bg-purple-50',
        urgency: 'Tip',
        urgencyColor: 'bg-blue-100 text-blue-700',
    },
];

const spendingData = [
    { name: 'Housing', value: 35, color: '#3B82F6', icon: Home },
    { name: 'Food & Dining', value: 22, color: '#F97316', icon: Utensils },
    { name: 'Transport', value: 15, color: '#8B5CF6', icon: Car },
    { name: 'Shopping', value: 18, color: '#EC4899', icon: ShoppingCart },
    { name: 'Utilities', value: 10, color: '#10B981', icon: Wifi },
];

const CustomerPortal: React.FC = () => {
    const [greeting, setGreeting] = useState('');
    const healthScore = 72;

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 75) return { stroke: '#10B981', text: 'text-green-600', bg: 'bg-green-50', label: 'Good' };
        if (score >= 50) return { stroke: '#F59E0B', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Fair' };
        return { stroke: '#EF4444', text: 'text-red-600', bg: 'bg-red-50', label: 'Needs Attention' };
    };

    const scoreInfo = getScoreColor(healthScore);
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (healthScore / 100) * circumference;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'on-time': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'On Time' };
            case 'late': return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', label: 'Late' };
            case 'missed': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Missed' };
            default: return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'Upcoming' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Compact Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-900 p-2 rounded-xl">
                            <Wallet className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 text-lg leading-tight">My Finance</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider ml-2">Self-Service</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Account Active
                        </div>
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            RK
                        </div>
                    </div>
                </div>
            </header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 py-8 space-y-8"
            >
                {/* 1. Welcome Hero */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-gray-900 to-gray-800 p-8 shadow-2xl text-white">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-blue-300 font-medium mb-2">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                                <span>AI Financial Advisor</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                <span className="opacity-80 font-light">{greeting}, Rajesh.</span> <br />
                                Your finances look healthy.
                            </h1>
                            <p className="text-gray-400 max-w-xl text-lg">
                                Next payment of <span className="text-white font-semibold">₹12,500</span> is due on
                                <span className="text-blue-300 font-semibold"> Feb 28, 2026</span>.
                                You have <span className="text-green-400 font-semibold">3 AI tips</span> to improve your score.
                            </p>
                        </div>

                        {/* Health Score Gauge */}
                        <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="54" fill="none"
                                        stroke={scoreInfo.stroke}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{healthScore}</span>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Health Score</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-bold text-green-400">+3 pts this month</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Outstanding Balance', value: '₹1,87,500', trend: '-₹12.5k', trendUp: false, positive: true, icon: Wallet, color: 'text-blue-600 bg-blue-50' },
                        { label: 'Next Payment Due', value: 'Feb 28', trend: '₹12,500', trendUp: false, positive: true, icon: CalendarClock, color: 'text-orange-600 bg-orange-50' },
                        { label: 'Credit Utilization', value: '42%', trend: '-5%', trendUp: false, positive: true, icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
                        { label: 'Savings Balance', value: '₹45,200', trend: '+₹3.2k', trendUp: true, positive: true, icon: PiggyBank, color: 'text-green-600 bg-green-50' },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
                                    stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 3. Payment Timeline + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment History Timeline */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
                                    <p className="text-xs text-gray-500 font-medium">Last 6 months</p>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                                View All <ArrowUpRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-0">
                            {paymentHistory.map((payment, idx) => {
                                const config = getStatusConfig(payment.status);
                                const StatusIcon = config.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        {/* Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110", config.bg)}>
                                                <StatusIcon className={cn("w-5 h-5", config.color)} />
                                            </div>
                                            {idx < paymentHistory.length - 1 && (
                                                <div className="w-0.5 h-8 bg-gray-100" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex items-center justify-between py-2">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{payment.month}</p>
                                                <p className="text-xs text-gray-500">Paid on {payment.date}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-900 text-sm">{payment.amount}</span>
                                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", config.bg, config.color)}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all"></div>
                            <Banknote className="w-8 h-8 mb-3 relative z-10" />
                            <h3 className="text-lg font-bold mb-1 relative z-10">Make a Payment</h3>
                            <p className="text-white/80 text-sm mb-4 relative z-10">Pay your upcoming EMI of ₹12,500 now to stay on track.</p>
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors relative z-10">
                                Pay Now
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Request Payment Holiday', icon: Pause },
                                    { label: 'Download Statement', icon: Download },
                                    { label: 'Contact Support', icon: MessageSquare },
                                ].map(action => (
                                    <button key={action.label} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <action.icon size={16} className="text-gray-400" />
                                            {action.label}
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 4. AI Recommendations + Spending Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Recommendations */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">AI Recommendations</h3>
                                <p className="text-xs text-gray-500 font-medium">Personalized tips to improve your financial health</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {aiRecommendations.map((rec, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h4 className="font-bold text-gray-900 text-sm">{rec.title}</h4>
                                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", rec.urgencyColor)}>
                                                    {rec.urgency}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{rec.description}</p>
                                        </div>
                                        <div className={cn("px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap", rec.impactColor)}>
                                            {rec.impact}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Spending Insights Donut */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Spending Insights</h3>
                        <p className="text-xs text-gray-500 font-medium mb-4">This month's breakdown</p>

                        <div className="h-48 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 600 }}
                                        formatter={(value: any) => [`${value}%`, '']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3">
                            {spendingData.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                    <div key={item.name} className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                                                <ItemIcon size={14} style={{ color: item.color }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="flex justify-center pt-4 pb-8">
                    <p className="text-xs text-gray-400 font-medium">Powered by Vaultverse AI Engine • {new Date().toLocaleDateString()}</p>
                </div>
            </motion.main>
        </div>
    );
};

export default CustomerPortal;
