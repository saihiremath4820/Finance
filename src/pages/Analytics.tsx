import React, { useState } from 'react';
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
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

import { Download, Filter, Bell, AlertTriangle, AlertCircle, Shield, TrendingDown } from 'lucide-react';
import { mockCustomers } from '../data/mockCustomers';
import { cn } from '../utils/utils';

const portfolioTrendData = [
    { month: 'Sep', highRisk: 620, critical: 120, medium: 980, low: 1800 },
    { month: 'Oct', highRisk: 640, critical: 135, medium: 1050, low: 1750 },
    { month: 'Nov', highRisk: 600, critical: 110, medium: 1020, low: 1800 },
    { month: 'Dec', highRisk: 580, critical: 95, medium: 990, low: 1820 },
    { month: 'Jan', highRisk: 550, critical: 85, medium: 970, low: 1880 },
    { month: 'Feb', highRisk: 530, critical: 72, medium: 940, low: 1950 },
];

const riskBySectorData = [
    { name: 'IT Services', value: 35, color: '#3B82F6' },
    { name: 'Finance', value: 25, color: '#10B981' },
    { name: 'Retail', value: 20, color: '#F59E0B' },
    { name: 'Manufacturing', value: 15, color: '#6366F1' },
    { name: 'Logistics', value: 5, color: '#EC4899' },
];

// Risk breakdown bar chart data
const riskBreakdownData = [
    { category: 'Critical', count: 342, color: '#DC2626', pct: '7.6%' },
    { category: 'High', count: 583, color: '#F97316', pct: '12.9%' },
    { category: 'Medium', count: 1124, color: '#EAB308', pct: '24.9%' },
    { category: 'Monitoring', count: 2456, color: '#2C83B9', pct: '54.6%' },
];

// Derive customer alerts from mock data
const customerAlerts = mockCustomers
    .filter(c => c.riskLevel === 'critical' || (c.riskLevel === 'high' && c.daysToDefault <= 30))
    .slice(0, 6)
    .map(c => ({
        id: c.id,
        name: c.name,
        riskScore: c.riskScore,
        riskLevel: c.riskLevel,
        daysToDefault: c.daysToDefault,
        sector: c.sector,
        trigger: c.signals[0]?.type?.replace('_', ' ') || 'risk spike',
    }));

const ALERT_COLORS = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertCircle },
    high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: AlertTriangle },
};

const Analytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'alerts'>('overview');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portfolio Analytics</h1>
                    <p className="text-gray-500 font-medium">Deep dive into risk trends, sector performance, and intervention efficacy</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue-500 text-white rounded-lg text-sm font-bold hover:bg-brand-blue-600 transition-colors">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {([
                    { key: 'overview', label: 'Overview & Trends' },
                    { key: 'breakdown', label: 'Risk Breakdown' },
                    { key: 'alerts', label: `Customer Alerts (${customerAlerts.length})` },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        id={`analytics-tab-${tab.key}`}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                            activeTab === tab.key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Tab 1: Overview & Trends ─────────────────────────────── */}
            {activeTab === 'overview' && (
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
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="critical" name="Critical Risk" stroke="#DC2626" strokeWidth={3} dot={{ r: 4, fill: '#DC2626', strokeWidth: 2, stroke: '#fff' }} />
                                    <Line type="monotone" dataKey="highRisk" name="High Risk" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} />
                                    <Line type="monotone" dataKey="medium" name="Medium Risk" stroke="#EAB308" strokeWidth={2} dot={{ r: 3, fill: '#EAB308', strokeWidth: 2, stroke: '#fff' }} />
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
                                        <Pie data={riskBySectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
            )}

            {/* ─── Tab 2: Risk Breakdown Chart ──────────────────────────── */}
            {activeTab === 'breakdown' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {riskBreakdownData.map(item => (
                            <div key={item.category} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{item.category}</span>
                                </div>
                                <div className="text-3xl font-black text-gray-900">{item.count.toLocaleString()}</div>
                                <div className="text-sm font-medium text-gray-500 mt-1">{item.pct} of portfolio</div>
                                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: item.pct }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Risk Distribution — 6 Month Trend</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={portfolioTrendData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="critical" name="Critical" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={28} />
                                    <Bar dataKey="highRisk" name="High" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={28} />
                                    <Bar dataKey="medium" name="Medium" fill="#EAB308" radius={[4, 4, 0, 0]} maxBarSize={28} />
                                    <Bar dataKey="low" name="Monitoring" fill="#2C83B9" radius={[4, 4, 0, 0]} maxBarSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Tab 3: Customer Alert Generation ─────────────────────── */}
            {activeTab === 'alerts' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                            <Bell size={16} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Auto-Generated Customer Alerts</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                {customerAlerts.length} customers require immediate intervention based on Risk Engine signals
                            </p>
                        </div>
                    </div>

                    {customerAlerts.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                            <Shield size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium">No critical alerts at this time. Portfolio is in a healthy state.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {customerAlerts.map(alert => {
                            const cfg = ALERT_COLORS[alert.riskLevel as keyof typeof ALERT_COLORS] ?? ALERT_COLORS.high;
                            const AlertIcon = cfg.icon;
                            return (
                                <div
                                    key={alert.id}
                                    id={`alert-card-${alert.id}`}
                                    className={cn(
                                        'bg-white rounded-2xl border-2 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden',
                                        cfg.border
                                    )}
                                >
                                    {/* Left accent stripe */}
                                    <div className={cn('absolute left-0 top-0 bottom-0 w-1', alert.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500')} />
                                    <div className="pl-3">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <AlertIcon size={16} className={cfg.text} />
                                                <span className={cn('text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border', cfg.text, cfg.bg, cfg.border)}>
                                                    {alert.riskLevel}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400">{alert.id}</span>
                                        </div>
                                        <h3 className="font-black text-gray-900 text-base mb-1">{alert.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium mb-3">
                                            {alert.sector} · Trigger: <span className="capitalize font-bold text-gray-700">{alert.trigger}</span>
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                                                <TrendingDown size={12} />
                                                {alert.daysToDefault <= 999 ? `Default in ${alert.daysToDefault}d` : 'Stable'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs font-black text-gray-900">Score: {alert.riskScore}</div>
                                                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn('h-full rounded-full', alert.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500')}
                                                        style={{ width: `${alert.riskScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Intervention Suggestion Display */}
                    <div className="bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 rounded-2xl p-6 text-white mt-6">
                        <h3 className="text-lg font-black mb-3">🤖 AI Intervention Suggestions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { action: 'Immediate Outreach', desc: 'Contact all critical-risk customers within 24 hours to offer payment holiday.', count: riskBreakdownData[0].count, badge: 'Critical', color: 'bg-red-500/20 border-red-300/30' },
                                { action: 'Loan Restructuring Review', desc: 'Schedule review meetings for high-risk customers with >3 month delinquency.', count: riskBreakdownData[1].count, badge: 'High', color: 'bg-orange-500/20 border-orange-300/30' },
                                { action: 'Proactive Financial Counseling', desc: 'Automated SMS/email nudge to medium-risk customers about savings strategies.', count: riskBreakdownData[2].count, badge: 'Medium', color: 'bg-yellow-500/20 border-yellow-300/30' },
                            ].map(suggestion => (
                                <div key={suggestion.action} className={cn('rounded-xl p-4 border backdrop-blur-sm', suggestion.color)}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                                            {suggestion.badge} · {suggestion.count.toLocaleString()} customers
                                        </span>
                                    </div>
                                    <h4 className="font-black text-sm mb-1">{suggestion.action}</h4>
                                    <p className="text-xs text-white/80 font-medium leading-relaxed">{suggestion.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
