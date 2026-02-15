import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ActivityItem {
    id: string;
    type: 'critical' | 'high' | 'success' | 'info';
    customerId: string;
    message: string;
    action: string;
    time: string;
}

interface ActivityStreamProps {
    activities: ActivityItem[];
}

const iconMap = {
    critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    high: { icon: Info, color: 'text-orange-500', bg: 'bg-orange-50' },
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    info: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
};

const ActivityStream: React.FC<ActivityStreamProps> = ({ activities }) => {
    return (
        <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
            {activities.map((item, index) => {
                const { icon: Icon, color, bg } = iconMap[item.type];
                return (
                    <div key={item.id} className="relative pl-8 pb-4">
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-100" />
                        )}
                        <div className={cn(
                            "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white z-10",
                            bg
                        )}>
                            <Icon size={12} className={color} />
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-3 hover:border-gray-200 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", color)}>
                                    {item.type.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                            </div>
                            <div className="text-xs font-bold text-gray-900 mb-1">
                                Customer ID: {item.customerId}
                            </div>
                            <div className="text-xs text-gray-500 leading-relaxed mb-2">
                                {item.message}
                            </div>
                            <div className="text-[10px] font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded inline-block">
                                Action: {item.action}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityStream;
