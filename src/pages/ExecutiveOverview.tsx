import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MetricCard from '../components/common/MetricCard';
import RiskDonutChart from '../components/charts/RiskDonutChart';
import SignalHeatmap from '../components/charts/SignalHeatmap';

import InterventionChart from '../components/charts/InterventionChart';
import {
    Clock,
    Activity,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    ShieldAlert
} from 'lucide-react';

// --- Data Constants ---
const riskDistributionData = [
    { name: 'Critical (0-30 days)', value: 342, color: '#DC2626' },
    { name: 'High (30-60 days)', value: 583, color: '#ffa314' },   // Orange
    { name: 'Medium (60-90 days)', value: 1124, color: '#FFC000' },
    { name: 'Monitoring (90+ days)', value: 2456, color: '#2C83B9' }, // Header Blue
];

const interventionStats = [
    { label: 'Grace Period Extension', success: '91%', count: 201, trend: '+5%', status: 'Excellent', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Financial Counseling', success: '82%', count: 134, trend: '+2%', status: 'Very High', color: 'bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100' },
    { label: 'Payment Holiday', success: '78%', count: 156, trend: '-1%', status: 'Effective', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Loan Restructuring', success: '64%', count: 89, trend: '+12%', status: 'Good', color: 'bg-amber-50 text-amber-700 border-amber-100' },
];

// --- Animations ---
const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const ExecutiveOverview: React.FC = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 max-w-[1600px] mx-auto space-y-8"
        >
            {/* 1. AI Insight Header - UPDATED THEME */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-brand-blue-500 p-8 shadow-xl text-white">
                {/* Background decoration matching the slide swooshes */}
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 p-24 bg-brand-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-white font-medium mb-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                            <Sparkles className="w-4 h-4 text-brand-orange-500 animate-pulse" />
                            <span className="text-sm tracking-wide">AI Daily Brief</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            <span className="opacity-80 font-light text-brand-blue-50">{greeting}, Anjali.</span> <br />
                            Portfolio risk is stable.
                        </h1>
                        <p className="text-white/80 max-w-xl text-lg">
                            Critical actions required on <span className="text-brand-orange-500 font-bold">3 sectors</span> today.
                            Intervention efficacy is up <span className="text-emerald-300 font-bold">12%</span> from last week.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/10 shadow-inner">
                        <Link to="/alerts" className="flex items-center gap-4 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 border border-red-500/20 group-hover:bg-red-500/30 transition-all duration-300">
                                <ShieldAlert className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black leading-none group-hover:text-red-400 transition-colors">5</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">Critical Alerts</span>
                            </div>
                        </Link>

                        <div className="w-px h-10 bg-white/10"></div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-brand-blue-100 border border-white/10">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold leading-none">Just Now</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">Last Refreshed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2. Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants}>
                    <MetricCard
                        title="Total At-Risk"
                        value="4,505"
                        trend={{ value: "8.3%", direction: 'up', positive: false }}
                        icon="AlertCircle"
                        subtitle="Customers >60 Risk"
                        color="orange"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard
                        title="24h Interventions"
                        value="89"
                        trend={{ value: "12%", direction: 'up', positive: true }}
                        icon="Zap"
                        subtitle="Active Actions"
                        color="blue" // Will use primary blue
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard
                        title="Prevented Defaults"
                        value="156"
                        trend={{ value: "23%", direction: 'up', positive: true }}
                        icon="ShieldCheck"
                        subtitle="This Month"
                        color="green"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard
                        title="Value Recovered"
                        value="₹45.2L"
                        trend={{ value: "34%", direction: 'up', positive: true }}
                        icon="Banknote"
                        subtitle="Loss Avoided"
                        color="green"
                    />
                </motion.div>
            </div>

            {/* 3. Main Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Intervention Efficacy */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-blue-50 rounded-2xl text-brand-blue-500">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Intervention Efficacy</h3>
                                <p className="text-sm text-gray-500 font-medium">Live success rates vs targets</p>
                            </div>
                        </div>
                        <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-xl py-2 px-4 cursor-pointer outline-none focus:ring-2 focus:ring-brand-blue-500/20 hover:bg-gray-100 transition-colors">
                            <option>Last 30 Days</option>
                            <option>This Quarter</option>
                        </select>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <InterventionChart />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-50">
                        {interventionStats.map(stat => (
                            <div key={stat.label} className={`text-center p-3 rounded-2xl hover:shadow-md transition-all duration-300 cursor-default border border-transparent ${stat.color}`}>
                                <div className="text-[10px] font-bold opacity-70 uppercase mb-1 truncate px-1 tracking-wider">{stat.label}</div>
                                <div className="text-xl font-bold">{stat.success}</div>
                                <div className={`text-[10px] font-bold mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.trend}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Risk Profile */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Risk Profile</h3>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue-500" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-h-[200px] relative my-4">
                        <RiskDonutChart data={riskDistributionData} />
                    </div>

                    <div className="space-y-4 mt-auto">
                        {riskDistributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{item.name.split('(')[0]}</span>
                                </div>
                                <span className="font-bold text-gray-900">{Math.round(item.value / 4505 * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 4. Deep Dive Signal Heatmap */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand-orange-50 rounded-2xl text-brand-orange-500">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Early Warning Signals</h3>
                        <p className="text-sm text-gray-500 font-medium">Real-time signal correlation matrix via AI Engine</p>
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <SignalHeatmap />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ExecutiveOverview;