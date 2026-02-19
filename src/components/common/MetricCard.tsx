import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MetricCardProps {
    label: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down';
    subtitle: string;
    accentColor: 'red' | 'cyan' | 'green' | 'orange';
}

const colorMap = {
    red: {
        border: 'border-l-[6px] border-red-600',
        trend: 'text-red-600',
    },
    cyan: {
        border: 'border-l-[6px] border-[#00AEEF]',
        trend: 'text-[#00AEEF]',
    },
    green: {
        border: 'border-l-[6px] border-green-600',
        trend: 'text-green-600',
    },
    orange: {
        border: 'border-l-[6px] border-[#E8931A]',
        trend: 'text-[#E8931A]',
    },
};

export const MetricCard = ({
    label,
    value,
    trend,
    trendDirection,
    subtitle,
    accentColor
}: MetricCardProps) => {
    const colors = colorMap[accentColor];

    return (
        <div className={cn(
            "bg-white",
            colors.border,
            "rounded-none",  // Sharp corners!
            "p-5 px-6",
            "shadow-sm hover:shadow-md",
            "transition-all duration-200",
            "hover:translate-x-1",  // Slides right on hover
            "min-h-[140px]",
            "flex flex-col justify-between"
        )}>
            {/* Label */}
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                {label}
            </div>

            {/* Value */}
            <div className="text-slate-900 text-[42px] font-extrabold leading-none mb-2">
                {value}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 text-xs">
                <span className={cn("font-bold flex items-center gap-1", colors.trend)}>
                    {trendDirection === 'up' ? '↑' : '↓'} {trend}
                </span>
                <span className="text-slate-500">{subtitle}</span>
            </div>
        </div>
    );
};

export default MetricCard;
