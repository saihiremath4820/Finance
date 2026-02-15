import React from 'react';
import type { Intervention } from '../../types';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../utils/utils';

interface InterventionRecommendationsProps {
    interventions: Intervention[];
}

const InterventionRecommendations: React.FC<InterventionRecommendationsProps> = ({ interventions }) => {
    const getIcon = (type: string) => {
        if (type.includes('Holiday')) return <Clock size={20} />;
        if (type.includes('Restructuring')) return <ShieldCheck size={20} />;
        return <MessageSquare size={20} />;
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">AI Intervention Strategy</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Ranked by predicted success rate</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <CheckCircle2 size={14} />
                    Model Confidence: 94%
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {interventions.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "relative group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                            item.rank === 1 ? "border-purple-200 bg-purple-50/30 ring-1 ring-purple-100" : "border-gray-100 bg-white"
                        )}
                    >
                        {item.rank === 1 && (
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg">
                                Recommended
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                item.rank === 1 ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "bg-gray-50 text-gray-400 group-hover:bg-barclays-blue group-hover:text-white transition-colors"
                            )}>
                                {getIcon(item.type)}
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Success Rate</div>
                                <div className={cn(
                                    "text-2xl font-black",
                                    item.successRate >= 75 ? "text-green-600" : "text-orange-600"
                                )}>
                                    {item.successRate}%
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{item.type}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
                            Based on the customer's cash flow deficit and external sector risk, this intervention offers the highest probability of avoiding default.
                        </p>

                        <button className={cn(
                            "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                            item.rank === 1
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700"
                                : "bg-gray-100 text-gray-400 group-hover:bg-gray-900 group-hover:text-white"
                        )}>
                            Initiate Action
                            <ArrowRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InterventionRecommendations;
