import React from 'react';
import * as LucideIcons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: string;
        direction: 'up' | 'down';
        positive: boolean;
    };
    icon: keyof typeof LucideIcons;
    subtitle: string;
    color: 'red' | 'orange' | 'blue' | 'green';
}

const colorMap = {
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    orange: { bg: 'bg-brand-orange-50', text: 'text-brand-orange-500', border: 'border-brand-orange-100' },
    blue: { bg: 'bg-brand-blue-50', text: 'text-brand-blue-500', border: 'border-brand-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, subtitle, color }) => {
    const Icon = LucideIcons[icon] as React.ElementType;
    const styles = colorMap[color];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
                </div>
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", styles.bg, styles.text)}>
                    <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-bold px-2 py-0.5 rounded-full border",
                        trend.positive ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                    )}>
                        {trend.direction === 'up' ? <LucideIcons.TrendingUp size={12} className="mr-1" /> : <LucideIcons.TrendingDown size={12} className="mr-1" />}
                        {trend.value}
                    </div>
                )}
                <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
            </div>
        </div>
    );
};

export default MetricCard;
