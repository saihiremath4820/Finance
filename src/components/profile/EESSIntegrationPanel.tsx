import React from 'react';
import type { EESSData } from '../../types';
import { Globe, TrendingDown, Layers, Activity, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/utils';

interface EESSIntegrationPanelProps {
    data: EESSData;
}

const EESSIntegrationPanel: React.FC<EESSIntegrationPanelProps> = ({ data }) => {
    return (
        <div className="bg-gradient-to-br from-[#00A9CE] to-[#0891B2] rounded-3xl p-1 text-white shadow-xl overflow-hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">External Economic Stress Analysis</h2>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">EESS Model v4.0</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* Sector Risk */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/60">
                            <Layers size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sector Outlook</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">{data.sectorName}</span>
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider",
                                    data.sectorRisk > 0.6 ? "bg-red-500/30 text-white" : "bg-yellow-500/30 text-white"
                                )}>
                                    {(data.sectorRisk * 100).toFixed(0)}% Risk
                                </span>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-xs font-medium text-white/80">
                                    <TrendingDown size={14} className="text-red-300" />
                                    {data.sectorTrend}
                                </li>
                                <li className="flex items-center gap-2 text-xs font-medium text-white/80">
                                    <TrendingDown size={14} className="text-red-300" />
                                    NIFTY {data.sectorName.split(' ')[0]} Index: {data.macroIndicators.marketIndex}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Regional Unemployment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/60">
                            <Globe size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Regional Stability</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">{data.regionName}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{data.regionalUnemployment}%</span>
                                <span className="text-xs text-red-300 font-bold uppercase">{data.unemploymentTrend}</span>
                            </div>
                            <p className="text-xs font-medium text-white/80">
                                Regional unemployment index is significantly above national average.
                            </p>
                        </div>
                    </div>

                    {/* Combined Score */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/60">
                            <Activity size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Combined EESS Score</span>
                        </div>
                        <div className="space-y-4">
                            <div className="text-5xl font-black">{(data.combinedScore * 100).toFixed(0)}%</div>
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000"
                                    style={{ width: `${data.combinedScore * 100}%` }}
                                />
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-center">
                                High External Stress Factor Detected
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Box */}
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Early Intervention Insight:</h4>
                        <p className="text-xs text-white/80 font-medium leading-relaxed">
                            The customer's employer sector is experiencing significant stress ({data.sectorTrend}).
                            Combined with local economic volatility in {data.regionName}, default probability is significantly elevated
                            despite historical repayment behavior. Suggest immediate proactive outreach.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EESSIntegrationPanel;
