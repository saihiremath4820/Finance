import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface RiskBadgeProps {
    score: number;
    level?: 'critical' | 'high' | 'medium' | 'low';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, size = 'md', showLabel = true }) => {
    const finalLevel = level || (score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low');

    const styles = {
        critical: 'bg-red-100 text-red-700 border-red-200',
        high: 'bg-orange-100 text-orange-700 border-orange-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <div className={cn(
            "inline-flex font-bold items-center rounded-full border",
            styles[finalLevel],
            sizes[size]
        )}>
            <span>{score}</span>
            {showLabel && <span className="ml-1 uppercase">{finalLevel}</span>}
        </div>
    );
};

export default RiskBadge;
