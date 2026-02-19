/**
 * FeatureEngineeringPanel  (NEW COMPONENT)
 * Displays all Feature Engineering Parameters required by the PPT:
 *   Financial Capacity  : PTI, DTI, Savings Buffer Ratio, Loan Exposure Ratio
 *   Behavioral Risk     : Payment Delay Ratio, Spending Spike Index, Credit Utilization Ratio
 *   External Stress     : Regional Unemployment Risk, Inflation Stress Index, Sector Risk Score
 */
import React from 'react';
import { TrendingUp, Activity, Globe, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../utils/utils';
import type { FeatureFlag } from '../../utils/riskEngine';

interface FeatureEngineeringPanelProps {
    featureFlags: FeatureFlag[];
    className?: string;
}

const GROUP_META = [
    {
        key: 'financial',
        label: 'Financial Capacity',
        desc: 'Ability to service debt obligations',
        icon: TrendingUp,
        iconBg: 'bg-brand-blue-50',
        iconColor: 'text-brand-blue-600',
        indices: [0, 1, 2, 3], // PTI, DTI, Savings Buffer, Loan Exposure
    },
    {
        key: 'behavioral',
        label: 'Behavioral Risk',
        desc: 'Historical payment & spending patterns',
        icon: Activity,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-600',
        indices: [4, 5, 6], // Payment Delay, Spending Spike, Credit Utilization
    },
    {
        key: 'external',
        label: 'External Stress',
        desc: 'Macro & sector-level risk environment',
        icon: Globe,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        indices: [7, 8, 9], // Regional Unemployment, Inflation, Sector Risk
    },
];

const SEVERITY_CONFIG = {
    critical: { label: 'Critical', icon: XCircle, bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', pct: 90 },
    high: { label: 'High', icon: AlertTriangle, bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', pct: 70 },
    medium: { label: 'Medium', icon: Info, bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', pct: 45 },
    low: { label: 'Low', icon: CheckCircle, bar: 'bg-blue-400', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', pct: 20 },
    good: { label: 'Good', icon: CheckCircle, bar: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', pct: 10 },
};

const FeatureRow: React.FC<{ flag: FeatureFlag }> = ({ flag }) => {
    const cfg = SEVERITY_CONFIG[flag.severity];
    const Icon = cfg.icon;
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 -mx-3 px-3 rounded-lg transition-colors">
            <div className={cn('flex-shrink-0 p-1.5 rounded-lg', cfg.bg)}>
                <Icon size={13} className={cfg.text} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-600 truncate">{flag.label}</span>
                    <span className={cn('text-xs font-black shrink-0', cfg.text)}>{flag.value}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
                        style={{ width: `${cfg.pct}%` }}
                    />
                </div>
            </div>
            <span className={cn('text-[9px] font-black uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded border', cfg.text, cfg.bg, cfg.border)}>
                {cfg.label}
            </span>
        </div>
    );
};

const FeatureEngineeringPanel: React.FC<FeatureEngineeringPanelProps> = ({ featureFlags, className }) => {
    if (!featureFlags || featureFlags.length === 0) return null;

    return (
        <div className={cn('bg-white p-8 rounded-2xl border border-gray-100 shadow-sm', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Feature Engineering Parameters</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                        XGBoost Model Inputs · 10 Parameters Across 3 Risk Groups
                    </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue-50 border border-brand-blue-200 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-brand-blue-500 animate-pulse" />
                    <span className="text-xs font-black text-brand-blue-700">Live Engine</span>
                </div>
            </div>

            {/* Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GROUP_META.map(group => {
                    const GroupIcon = group.icon;
                    const flags = group.indices.map(i => featureFlags[i]).filter(Boolean);
                    const criticalCount = flags.filter(f => f.severity === 'critical' || f.severity === 'high').length;

                    return (
                        <div
                            key={group.key}
                            className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', group.iconBg)}>
                                    <GroupIcon size={18} className={group.iconColor} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-gray-900">{group.label}</h3>
                                    <p className="text-[10px] text-gray-400 font-medium">{group.desc}</p>
                                </div>
                                {criticalCount > 0 && (
                                    <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                        {criticalCount} Alert{criticalCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-0">
                                {flags.map((flag, i) => (
                                    <FeatureRow key={i} flag={flag} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeatureEngineeringPanel;
