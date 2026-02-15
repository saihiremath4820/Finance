import React from 'react';
import { motion } from 'framer-motion';
import PremFinaHeader from '../components/layout/PremFinaHeader';
import { ArrowUpRight, Users, FileText, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const BrokerDashboard: React.FC = () => {
    const stats = [
        { label: 'Active Policies', value: '1,245', trend: '+12%', icon: FileText, color: 'text-blue-600 bg-blue-50' },
        { label: 'Pending Quotes', value: '48', trend: '-2%', icon: Users, color: 'text-orange-600 bg-orange-50' },
        { label: 'Commission Earned', value: '£24.5k', trend: '+8%', icon: CreditCard, color: 'text-green-600 bg-green-50' },
        { label: 'Approval Rate', value: '94%', trend: '+1.5%', icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <PremFinaHeader />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero / Welcome Section */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Broker Portal</h1>
                    <p className="text-gray-500 text-lg">Manage your portfolio and track performance in real-time.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-full", stat.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity & Policies */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Applications Table */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-1000 delay-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                            <button className="text-sm font-bold text-[#F15A24] hover:text-[#d14412] flex items-center gap-1 transition-colors">
                                View All <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Policy Type</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { name: 'Acme Corp Ltd', type: 'Commercial Liability', amount: '£12,450', date: 'Today', status: 'Pending' },
                                        { name: 'Globex Logistics', type: 'Fleet Insurance', amount: '£45,200', date: 'Yesterday', status: 'Active' },
                                        { name: 'Stark Industries', type: 'Cyber Security', amount: '£89,000', date: 'Oct 24', status: 'Review' },
                                        { name: 'Wayne Ent.', type: 'Property', amount: '£125,000', date: 'Oct 22', status: 'Active' },
                                    ].map((row, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                                            <td className="py-4 text-sm font-bold text-gray-900">{row.name}</td>
                                            <td className="py-4 text-sm text-gray-600">{row.type}</td>
                                            <td className="py-4 text-sm font-medium text-gray-900">{row.amount}</td>
                                            <td className="py-4 text-sm text-gray-500">{row.date}</td>
                                            <td className="py-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide",
                                                    row.status === 'Active' ? "bg-green-100 text-green-700" :
                                                        row.status === 'Pending' ? "bg-orange-100 text-orange-700" :
                                                            "bg-blue-100 text-blue-700"
                                                )}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions / News */}
                    <div className="space-y-6">
                        <div className="bg-[#F15A24] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all"></div>
                            <h3 className="text-lg font-bold mb-2 relative z-10">New Feature: AI Risk Assessment</h3>
                            <p className="text-white/80 text-sm mb-4 relative z-10">Try our new automated risk scoring tool for faster policy approvals.</p>
                            <button className="bg-white text-[#F15A24] px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors relative z-10">Try Now</button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors group">
                                    Start New Quote <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors group">
                                    Manage Renewals <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors group">
                                    Broker Support <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BrokerDashboard;
