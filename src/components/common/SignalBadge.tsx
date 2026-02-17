import React from 'react';
import type { SignalType } from '../../types';
import { cn } from '../../utils/utils';

interface SignalBadgeProps {
    type: SignalType;
    severity: 'critical' | 'high' | 'medium' | 'low';
    tooltip?: string;
}

const colorMap = {
    critical: 'bg-red-500',
    high: 'bg-brand-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-brand-blue-500',
};

const SignalBadge: React.FC<SignalBadgeProps> = ({ severity, tooltip }) => {
    return (
        <div
            className={cn("w-3 h-3 rounded-full cursor-help", colorMap[severity])}
            title={tooltip}
        />
    );
};

export default SignalBadge;
