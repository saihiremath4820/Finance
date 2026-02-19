/**
 * RiskEngine.tsx  (NEW PAGE)
 * Real-time Risk Probability Score engine with:
 *  - XGBoost-based prediction
 *  - Threshold customization
 *  - SHAP feature importance
 *  - API integration w/ JSON validation & 400 errors
 *  - Risk score storage
 */
import React, { useState, useCallback, useMemo } from 'react';
import { RadialBarChart, RadialBar } from 'recharts';
import {
    Cpu, Sliders, AlertCircle, CheckCircle2, XCircle, RefreshCw,
    ChevronDown, ChevronUp, Database, Zap, TrendingUp, Activity, Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/utils';
import {
    computeRiskScore,
    deriveFeatureSet,
    mockAPIScoreEndpoint,
    riskStore,
    DEFAULT_THRESHOLDS,
    type RiskThresholds,
    type RiskScoreResult,
    type APIResponseBody,
} from '../utils/riskEngine';
import { mockCustomers } from '../data/mockCustomers';

// ─── Sub-components ────────────────────────────────────────────────────────────

const ScoreGauge: React.FC<{ score: number; category: string; label: string }> = ({ score, category, label }) => {
    const color =
        category === 'critical' ? '#DC2626'
            : category === 'high' ? '#F97316'
                : category === 'medium' ? '#EAB308'
                    : '#3B82F6';

    const data = [{ name: 'score', value: score, fill: color }];

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="60%" outerRadius="100%"
                    startAngle={180} endAngle={0}
                    data={data}
                    width={192} height={192}
                >
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#F3F4F6' }} />
                </RadialBarChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <div className="text-5xl font-black" style={{ color }}>{score}</div>
                    <div className="text-xs font-bold text-gray-400 mt-1">/100</div>
                </div>
            </div>
            <div className={cn(
                'mt-2 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider border',
                category === 'critical' ? 'text-red-700 bg-red-50 border-red-200'
                    : category === 'high' ? 'text-orange-700 bg-orange-50 border-orange-200'
                        : category === 'medium' ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                            : 'text-blue-700 bg-blue-50 border-blue-200'
            )}>
                {label}
            </div>
        </div>
    );
};

const SHAPBar: React.FC<{ contribution: RiskScoreResult['shapContributions'][0] }> = ({ contribution }) => {
    const isRisk = contribution.direction === 'risk';
    return (
        <div className="flex items-center gap-3 py-2 group">
            <div className="w-32 text-right text-[10px] font-bold text-gray-500 leading-tight shrink-0">
                {contribution.feature}
            </div>
            <div className="flex-1 flex items-center gap-2">
                {isRisk ? (
                    <>
                        <div className="flex-1" />
                        <div
                            className="h-5 bg-red-400 rounded-r-md transition-all duration-700 flex items-center justify-end pr-1"
                            style={{ width: `${Math.min(Math.abs(contribution.impact), 25) * 3}%`, minWidth: '12px' }}
                        >
                            <span className="text-[9px] font-black text-white">{Math.abs(contribution.impact)}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="h-5 bg-green-400 rounded-l-md transition-all duration-700 flex items-center justify-start pl-1"
                            style={{ width: `${Math.min(Math.abs(contribution.impact), 25) * 3}%`, minWidth: '12px' }}
                        >
                            <span className="text-[9px] font-black text-white">{Math.abs(contribution.impact)}</span>
                        </div>
                        <div className="flex-1" />
                    </>
                )}
            </div>
            <div className="w-20 text-[10px] font-medium text-gray-400 shrink-0">{contribution.rawValue}</div>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const RiskEngine: React.FC = () => {
    const [selectedCustomerId, setSelectedCustomerId] = useState(mockCustomers[0].id);
    const [thresholds, setThresholds] = useState<RiskThresholds>(DEFAULT_THRESHOLDS);
    const [result, setResult] = useState<RiskScoreResult | null>(null);
    const [apiResponse, setApiResponse] = useState<APIResponseBody | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAPIPanel, setShowAPIPanel] = useState(false);
    const [showStorage, setShowStorage] = useState(false);
    const [apiBodyInput, setApiBodyInput] = useState('');
    const [apiError, setApiError] = useState('');

    const selectedCustomer = useMemo(
        () => mockCustomers.find(c => c.id === selectedCustomerId)!,
        [selectedCustomerId]
    );

    // Compute from selected customer
    const runEngine = useCallback(async () => {
        setLoading(true);
        setApiError('');
        setApiResponse(null);

        await new Promise(r => setTimeout(r, 400)); // simulate processing
        const features = deriveFeatureSet(selectedCustomer as any);
        const res = computeRiskScore(features, thresholds);
        riskStore.save(selectedCustomer.id, res);
        setResult(res);
        setLoading(false);
    }, [selectedCustomer, thresholds]);

    // Mock API call
    const runMockAPI = useCallback(async () => {
        setApiError('');
        let body: unknown;
        try {
            body = JSON.parse(apiBodyInput);
        } catch {
            setApiError('Invalid JSON: please fix syntax errors before submitting.');
            return;
        }
        setLoading(true);
        const resp = await mockAPIScoreEndpoint(body);
        setApiResponse(resp);
        if (resp.success && resp.data) setResult(resp.data);
        setLoading(false);
    }, [apiBodyInput]);

    // Pre-fill API body from selected customer
    const prefillAPIBody = useCallback(() => {
        const features = deriveFeatureSet(selectedCustomer as any);
        const body = {
            customerId: selectedCustomer.id,
            features,
            thresholds,
        };
        setApiBodyInput(JSON.stringify(body, null, 2));
    }, [selectedCustomer, thresholds]);

    const storedScores = riskStore.getAll().slice(-15).reverse();


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue-500 flex items-center justify-center shadow-lg shadow-brand-blue-500/20">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        Risk Engine
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        XGBoost-based real-time risk scoring · Feature engineering · SHAP explainability
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-black text-green-700">Engine Online</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* ─── Left Panel: Controls ─────────────────────────────── */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Customer Selector */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Select Customer</h3>
                        <select
                            id="engine-customer-select"
                            value={selectedCustomerId}
                            onChange={e => {
                                setSelectedCustomerId(e.target.value);
                                setResult(null);
                                setApiResponse(null);
                            }}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20"
                        >
                            {mockCustomers.slice(0, 10).map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.riskLevel.toUpperCase()} — {c.riskScore}/100)
                                </option>
                            ))}
                        </select>

                        {selectedCustomer && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-xs font-medium text-gray-500 space-y-1.5">
                                <div className="flex justify-between"><span>Employer</span><span className="font-bold text-gray-900">{selectedCustomer.employer}</span></div>
                                <div className="flex justify-between"><span>Sector</span><span className="font-bold text-gray-900">{selectedCustomer.sector}</span></div>
                                <div className="flex justify-between"><span>CIBIL Score</span><span className="font-bold text-gray-900">{selectedCustomer.creditScore}</span></div>
                                <div className="flex justify-between"><span>Monthly Salary</span><span className="font-bold text-gray-900">₹{selectedCustomer.salary.toLocaleString()}</span></div>
                            </div>
                        )}
                    </div>

                    {/* Threshold Customization */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Sliders size={16} className="text-brand-blue-500" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Threshold Customization</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'lowMax' as const, label: 'Low Max', color: 'text-blue-600', description: 'Score ≤ this = Low Risk' },
                                { key: 'mediumMax' as const, label: 'Medium Max', color: 'text-yellow-600', description: 'Score ≤ this = Medium Risk' },
                                { key: 'highMax' as const, label: 'High Max', color: 'text-orange-600', description: 'Score ≤ this = High Risk' },
                            ].map(({ key, label, color, description }) => (
                                <div key={key}>
                                    <div className="flex justify-between items-baseline mb-1.5">
                                        <label className={cn('text-xs font-black', color)}>{label}</label>
                                        <span className="text-lg font-black text-gray-900">{thresholds[key]}</span>
                                    </div>
                                    <input
                                        type="range" min={5} max={95}
                                        value={thresholds[key]}
                                        onChange={e => setThresholds(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                        className="w-full h-2 appearance-none rounded-full bg-gray-100 accent-brand-blue-500 cursor-pointer"
                                        id={`threshold-${key}`}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">{description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                            <div className="flex gap-2 text-[10px] font-bold">
                                <span className="text-blue-700">Low ≤{thresholds.lowMax}</span>
                                <span className="text-yellow-700">Med ≤{thresholds.mediumMax}</span>
                                <span className="text-orange-700">High ≤{thresholds.highMax}</span>
                                <span className="text-red-700">Crit &gt;{thresholds.highMax}</span>
                            </div>
                        </div>
                    </div>

                    {/* Run Button */}
                    <button
                        id="run-risk-engine-btn"
                        onClick={runEngine}
                        disabled={loading}
                        className={cn(
                            'w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg',
                            loading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-brand-blue-500 text-white hover:bg-brand-blue-600 shadow-brand-blue-500/30 hover:shadow-brand-blue-500/50'
                        )}
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                        {loading ? 'Computing...' : 'Run Risk Engine'}
                    </button>
                </div>

                {/* ─── Right Panel: Results ─────────────────────────────── */}
                <div className="xl:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <div className={cn(
                                    'bg-white p-8 rounded-2xl border-2 shadow-sm',
                                    result.borderColor
                                )}>
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <ScoreGauge score={result.score} category={result.category} label={result.label} />
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                                    Risk Assessment Complete
                                                </h2>
                                                <p className="text-sm text-gray-500 font-medium mt-1">
                                                    Customer: <span className="font-bold text-gray-900">{selectedCustomer.name}</span> · Computed at {new Date(result.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>

                                            {/* Quick summary metrics */}
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { label: 'Top Risk Driver', value: result.shapContributions[0]?.feature || '—', icon: TrendingUp, color: 'text-red-600' },
                                                    { label: 'Top Safe Factor', value: result.shapContributions.find(c => c.direction === 'safe')?.feature || '—', icon: Activity, color: 'text-green-600' },
                                                    { label: 'All Signals', value: `${result.featureFlags.filter(f => f.severity === 'critical' || f.severity === 'high').length} Alerts`, icon: AlertCircle, color: 'text-orange-600' },
                                                ].map(m => {
                                                    const Icon = m.icon;
                                                    return (
                                                        <div key={m.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                            <Icon size={14} className={cn('mb-1', m.color)} />
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.label}</div>
                                                            <div className="text-xs font-black text-gray-900 mt-0.5 leading-tight">{m.value}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SHAP Feature Importance */}
                                <div className="bg-gray-900 p-8 rounded-2xl text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-black text-white">SHAP Feature Importance</h3>
                                            <p className="text-gray-400 text-xs mt-1">
                                                Red bars = increase risk · Green bars = reduce risk
                                            </p>
                                        </div>
                                        <div className="flex gap-3 text-xs">
                                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />Risk</span>
                                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />Safe</span>
                                        </div>
                                    </div>

                                    <div className="space-y-0 divide-y divide-white/5">
                                        {result.shapContributions.map((contribution, i) => (
                                            <SHAPBar key={i} contribution={contribution} />
                                        ))}
                                    </div>

                                    {/* Risk Driver Explanation Section */}
                                    <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
                                        <h4 className="text-sm font-black text-brand-blue-400 mb-2">Risk Driver Explanation</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            The dominant factor elevating this customer's risk score to{' '}
                                            <span className={cn('font-black', result.color.replace('text-', 'text-'))}>{result.score}</span> is{' '}
                                            <span className="text-red-300 font-bold">{result.shapContributions[0]?.feature}</span>{' '}
                                            (+{result.shapContributions[0]?.impact} pts). This is compounded by{' '}
                                            <span className="text-orange-300 font-bold">{result.shapContributions[1]?.feature}</span>{' '}
                                            (+{result.shapContributions[1]?.impact} pts).{' '}
                                            {result.shapContributions.find(c => c.direction === 'safe') &&
                                                `Mitigating factors include ${result.shapContributions.find(c => c.direction === 'safe')?.feature} (${result.shapContributions.find(c => c.direction === 'safe')?.impact} pts).`
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Feature Flags Summary */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-5">Feature Parameter Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                label: '📊 Financial Capacity',
                                                flags: result.featureFlags.slice(0, 4),
                                                Icon: TrendingUp, iconColor: 'text-brand-blue-600'
                                            },
                                            {
                                                label: '🔁 Behavioral Risk',
                                                flags: result.featureFlags.slice(4, 7),
                                                Icon: Activity, iconColor: 'text-orange-600'
                                            },
                                            {
                                                label: '🌐 External Stress',
                                                flags: result.featureFlags.slice(7, 10),
                                                Icon: Globe, iconColor: 'text-purple-600'
                                            },
                                        ].map(group => (
                                            <div key={group.label} className="space-y-2">
                                                <h4 className="text-xs font-black text-gray-700 mb-3">{group.label}</h4>
                                                {group.flags.map((flag, i) => (
                                                    <div key={i} className={cn(
                                                        'flex items-center justify-between px-3 py-2 rounded-xl border text-xs',
                                                        flag.severity === 'critical' ? 'bg-red-50 border-red-100' :
                                                            flag.severity === 'high' ? 'bg-orange-50 border-orange-100' :
                                                                flag.severity === 'medium' ? 'bg-yellow-50 border-yellow-100' :
                                                                    'bg-green-50 border-green-100'
                                                    )}>
                                                        <span className="font-medium text-gray-600">{flag.label.split('(')[0].trim()}</span>
                                                        <span className={cn(
                                                            'font-black',
                                                            flag.severity === 'critical' ? 'text-red-700' :
                                                                flag.severity === 'high' ? 'text-orange-700' :
                                                                    flag.severity === 'medium' ? 'text-yellow-700' :
                                                                        'text-green-700'
                                                        )}>{flag.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center"
                            >
                                <div className="w-16 h-16 bg-brand-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Cpu size={28} className="text-brand-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Customer & Run Engine</h3>
                                <p className="text-gray-400 text-sm">
                                    Choose a customer, customize thresholds, and click "Run Risk Engine" to compute the risk score.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ─── API Integration Panel ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                    onClick={() => setShowAPIPanel(v => !v)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
                    id="toggle-api-panel"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                            <Zap size={16} className="text-yellow-400" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black text-gray-900">API Integration Layer</h3>
                            <p className="text-xs text-gray-500">POST /api/v1/risk-score · JSON validation · 400 error handling</p>
                        </div>
                    </div>
                    {showAPIPanel ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

                <AnimatePresence>
                    {showAPIPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 pt-0 border-t border-gray-50 space-y-4">
                                <div className="flex gap-3">
                                    <button
                                        onClick={prefillAPIBody}
                                        className="text-xs font-bold text-brand-blue-600 bg-brand-blue-50 border border-brand-blue-100 px-3 py-1.5 rounded-lg hover:bg-brand-blue-100 transition-colors"
                                        id="prefill-api-body-btn"
                                    >
                                        ↗ Auto-fill from selected customer
                                    </button>
                                    <span className="text-xs text-gray-400 font-medium self-center">or type a custom JSON body below</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Request Body (JSON)
                                        </label>
                                        <textarea
                                            value={apiBodyInput}
                                            onChange={e => { setApiBodyInput(e.target.value); setApiError(''); }}
                                            rows={14}
                                            placeholder={'{\n  "customerId": "CU789456",\n  "features": { ... }\n}'}
                                            className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20 resize-none"
                                            id="api-body-textarea"
                                            spellCheck={false}
                                        />
                                        {apiError && (
                                            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-red-600 bg-red-50 border border-red-100 p-2 rounded-lg">
                                                <XCircle size={14} />
                                                {apiError}
                                            </div>
                                        )}
                                        <button
                                            onClick={runMockAPI}
                                            disabled={loading || !apiBodyInput.trim()}
                                            className={cn(
                                                'mt-3 w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all',
                                                loading || !apiBodyInput.trim()
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                            )}
                                            id="submit-api-btn"
                                        >
                                            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                                            POST /api/v1/risk-score
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            API Response
                                        </label>
                                        <div className="h-64 overflow-auto bg-gray-900 rounded-xl border border-gray-700 p-4">
                                            {apiResponse ? (
                                                <pre className={cn(
                                                    'text-xs font-mono leading-relaxed',
                                                    apiResponse.success ? 'text-green-400' : 'text-red-400'
                                                )}>
                                                    {JSON.stringify({
                                                        statusCode: apiResponse.statusCode,
                                                        success: apiResponse.success,
                                                        ...(apiResponse.error ? { error: apiResponse.error } : {}),
                                                        ...(apiResponse.data ? {
                                                            data: {
                                                                score: apiResponse.data.score,
                                                                category: apiResponse.data.category,
                                                                label: apiResponse.data.label,
                                                                timestamp: apiResponse.data.timestamp,
                                                                topDrivers: apiResponse.data.shapContributions.slice(0, 3),
                                                            }
                                                        } : {}),
                                                    }, null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                                    <Zap size={24} className="mb-2 opacity-30" />
                                                    <span className="text-xs font-medium">Response will appear here</span>
                                                </div>
                                            )}
                                        </div>
                                        {apiResponse && (
                                            <div className={cn(
                                                'flex items-center gap-2 mt-3 text-xs font-bold px-3 py-2 rounded-lg border',
                                                apiResponse.success
                                                    ? 'text-green-700 bg-green-50 border-green-200'
                                                    : 'text-red-700 bg-red-50 border-red-200'
                                            )}>
                                                {apiResponse.success
                                                    ? <><CheckCircle2 size={14} /> 200 OK — Score computed & stored</>
                                                    : <><XCircle size={14} /> {apiResponse.statusCode} Error — {apiResponse.error}</>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── Risk Score Storage Panel ──────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                    onClick={() => setShowStorage(v => !v)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
                    id="toggle-storage-panel"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                            <Database size={16} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black text-gray-900">Risk Score Storage</h3>
                            <p className="text-xs text-gray-500">Last {storedScores.length} computed scores · localStorage-backed</p>
                        </div>
                    </div>
                    {showStorage ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

                <AnimatePresence>
                    {showStorage && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 pt-0 border-t border-gray-50">
                                {storedScores.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm font-medium">
                                        No scores stored yet. Run the engine to start storing results.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-2 font-black text-gray-400 uppercase tracking-wider">Customer ID</th>
                                                    <th className="pb-2 font-black text-gray-400 uppercase tracking-wider">Score</th>
                                                    <th className="pb-2 font-black text-gray-400 uppercase tracking-wider">Category</th>
                                                    <th className="pb-2 font-black text-gray-400 uppercase tracking-wider">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {storedScores.map((s, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50">
                                                        <td className="py-2 font-mono font-bold text-gray-700">{s.customerId}</td>
                                                        <td className="py-2 font-black text-gray-900">{s.score}</td>
                                                        <td className="py-2">
                                                            <span className={cn(
                                                                'px-2 py-0.5 rounded-full font-black uppercase tracking-wider text-[10px] border',
                                                                s.category === 'critical' ? 'text-red-700 bg-red-50 border-red-100' :
                                                                    s.category === 'high' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                                                                        s.category === 'medium' ? 'text-yellow-700 bg-yellow-50 border-yellow-100' :
                                                                            'text-blue-700 bg-blue-50 border-blue-100'
                                                            )}>
                                                                {s.category}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-gray-400">{new Date(s.timestamp).toLocaleTimeString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RiskEngine;
