import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import { Download, Filter } from 'lucide-react';

const portfolioTrendData = [
    { month: 'Sep', highRisk: 620, critical: 120 },
    { month: 'Oct', highRisk: 640, critical: 135 },
    { month: 'Nov', highRisk: 600, critical: 110 },
    { month: 'Dec', highRisk: 580, critical: 95 },
    { month: 'Jan', highRisk: 550, critical: 85 },
    { month: 'Feb', highRisk: 530, critical: 72 },
];

const riskBySectorData = [
    { name: 'IT Services', value: 35, color: '#3B82F6' },
    { name: 'Finance', value: 25, color: '#10B981' },
    { name: 'Retail', value: 20, color: '#F59E0B' },
    { name: 'Manufacturing', value: 15, color: '#6366F1' },
    { name: 'Logistics', value: 5, color: '#EC4899' },
];

const Analytics: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portfolio Analytics</h1>
                    <p className="text-gray-500 font-medium">Deep dive into risk trends, sector performance, and intervention efficacy</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-barclays-blue text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Portfolio Value"
                    value="₹142.5Cr"
                    trend={{ value: "2.1%", direction: 'up', positive: true }}
                    icon="TrendingUp"
                    subtitle="vs Previous Quarter"
                    color="blue"
                />
                <MetricCard
                    title="Avg Risk Score"
                    value="72.4"
                    trend={{ value: "1.5 pts", direction: 'up', positive: true }}
                    icon="ShieldCheck"
                    subtitle="IMPROVEMENT"
                    color="green"
                />
                <MetricCard
                    title="Critical Exposure"
                    value="₹4.2Cr"
                    trend={{ value: "12%", direction: 'down', positive: true }}
                    icon="AlertTriangle"
                    subtitle="Decreased Risk"
                    color="orange"
                />
                <MetricCard
                    title="Active Customers"
                    value="12,450"
                    trend={{ value: "4.5%", direction: 'up', positive: true }}
                    icon="Users"
                    subtitle="New Acquisitions"
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Trend Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Risk Trend (6 Months)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={portfolioTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                                />
                                <Line type="monotone" dataKey="highRisk" name="High Risk Users" stroke="#EA580C" strokeWidth={3} dot={{ r: 4, fill: '#EA580C', strokeWidth: 2, stroke: '#fff' }} />
                                <Line type="monotone" dataKey="critical" name="Critical Risk Users" stroke="#DC2626" strokeWidth={3} dot={{ r: 4, fill: '#DC2626', strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sector Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Risk Concentration by Sector</h2>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskBySectorData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskBySectorData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="ml-8 space-y-3">
                            {riskBySectorData.map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
