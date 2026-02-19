import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Printer, MoreHorizontal } from 'lucide-react';
import { mockCustomers } from '../data/mockCustomers';
import CustomerProfileHeader from '../components/profile/CustomerProfileHeader';
import FinancialStressTimeline from '../components/profile/FinancialStressTimeline';
import SignalBreakdown from '../components/profile/SignalBreakdown';
import TransactionAnalysis from '../components/profile/TransactionAnalysis';
import EESSIntegrationPanel from '../components/profile/EESSIntegrationPanel';
import InterventionRecommendations from '../components/profile/InterventionRecommendations';
import SHAPDashboard from '../components/profile/SHAPDashboard';
import Button from '../components/common/Button';

const CustomerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const customer = useMemo(() => {
        return mockCustomers.find(c => c.id === id) || mockCustomers[0];
    }, [id]);

    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors group"
                >
                    <div className="p-2 bg-white border border-gray-100 rounded-xl group-hover:border-gray-200 shadow-sm transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Monitoring
                </button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 size={16} /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer size={16} /> Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                        <MoreHorizontal size={16} />
                    </Button>
                    <Button variant="primary" size="sm">
                        Intervene Now
                    </Button>
                </div>
            </div>

            {/* 1. Profile Header */}
            <CustomerProfileHeader customer={customer} />

            {/* 2. Stress Timeline */}
            <FinancialStressTimeline events={customer.timeline} />

            {/* 3. Signal Breakdown Side-by-Side Panels */}
            <SignalBreakdown metrics={customer.financialMetrics} />

            {/* 4. Transaction & Category Analysis */}
            <TransactionAnalysis metrics={customer.financialMetrics} />

            {/* 5. 🔥 EESS Integration - The Differentiator */}
            <EESSIntegrationPanel data={customer.eess} />

            {/* 6. AI Intervention Strategy */}
            <InterventionRecommendations interventions={customer.recommendedInterventions} />

            {/* 7. SHAP Dashboard */}
            <SHAPDashboard />

            <div className="flex flex-col items-center justify-center pt-12 pb-8 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-400 tracking-tight">TrustVault</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    © 2026 TrustVault Finance. All rights reserved. Confidential & Proprietary.
                </p>
            </div>
        </div>
    );
};

export default CustomerProfile;
