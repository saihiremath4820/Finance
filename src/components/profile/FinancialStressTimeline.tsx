import React from 'react';
import type { TimelineEvent } from '../../types';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../utils/utils';

interface FinancialStressTimelineProps {
    events: TimelineEvent[];
}

const FinancialStressTimeline: React.FC<FinancialStressTimelineProps> = ({ events }) => {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-10">
                <LucideIcons.History className="w-5 h-5 text-barclays-blue" />
                <h2 className="text-lg font-bold text-gray-900">Financial Stress Timeline (90 Days)</h2>
            </div>

            <div className="relative pt-12 pb-12">
                {/* Horizontal Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 -translate-y-1/2 rounded-full opacity-20" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 rounded-full" />

                <div className="relative flex justify-between items-center gap-4">
                    {events.map((event, index) => {
                        const Icon = (LucideIcons as any)[event.icon] || LucideIcons.Circle;
                        const severityColors = {
                            normal: 'bg-green-500',
                            early: 'bg-yellow-500',
                            warning: 'bg-orange-500',
                            critical: 'bg-red-500'
                        };

                        return (
                            <div key={index} className="flex flex-col items-center relative group min-w-[100px]">
                                {/* Event Label (Top) */}
                                <div className="absolute bottom-full mb-6 text-center transform -translate-y-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-0 pointer-events-none">
                                    <div className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-xl whitespace-nowrap">
                                        {event.event}
                                    </div>
                                    <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1" />
                                </div>

                                <div className="text-[10px] font-bold text-gray-400 absolute bottom-full mb-2 uppercase tracking-tighter">
                                    {event.event.split(' ')[0]}
                                </div>

                                {/* Event Dot */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-transform group-hover:scale-125 cursor-pointer",
                                    severityColors[event.severity]
                                )}>
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <Icon size={10} />
                                    </div>
                                </div>

                                {/* Date (Bottom) */}
                                <div className="absolute top-full mt-4 flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FinancialStressTimeline;
