import React, { useState } from 'react';
import {
    MoreHorizontal,
    Columns,
    List,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/utils';

// Types
interface Alert {
    id: string;
    type: 'critical' | 'high' | 'warning' | 'info';
    title: string;
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved'; // Updated statuses
    customer?: string;
    assignee?: string;
}

// Mock Data
const mockAlerts: Alert[] = [
    {
        id: 'AL-1092',
        type: 'critical',
        title: 'Imminent Default Prediction',
        description: 'Customer CU-7892 has exhibited 3 consecutive missed payments and rapid savings depletion.',
        timestamp: '10 min ago',
        status: 'new',
        customer: 'Sarah Jenkins'
    },
    {
        id: 'AL-1093',
        type: 'high',
        title: 'Unusual Large Withdrawal',
        description: 'Single transaction of ₹4,50,000 detected. Deviation from normal spending patterns > 500%.',
        timestamp: '45 min ago',
        status: 'new',
        customer: 'Rajiv Malhotra'
    },
    {
        id: 'AL-1096',
        type: 'high',
        title: 'Income Source Loss',
        description: 'Primary salary credit missing for 2 consecutive cycles.',
        timestamp: 'Yesterday',
        status: 'investigating',
        customer: 'Amit Patel',
        assignee: 'Risk Team A'
    },
    {
        id: 'AL-1097',
        type: 'critical',
        title: 'Fraud Pattern Match',
        description: 'Velocity check failed on recent micro-transactions.',
        timestamp: '2 days ago',
        status: 'resolved',
        customer: 'Priya Sharma',
        assignee: 'Fraud Ops'
    }
];

const AlertManagement: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

    const StatusLane = ({ title, alerts }: { title: string, alerts: Alert[] }) => (
        <div className="bg-gray-50/50 rounded-2xl p-4 flex flex-col h-full border border-gray-100 min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{alerts.length}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing group relative overflow-hidden"
                        >
                            {/* Priority Indicator Strip */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1",
                                alert.type === 'critical' ? "bg-red-500" :
                                    alert.type === 'high' ? "bg-orange-500" : "bg-blue-500"
                            )} />

                            <div className="pl-3">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                                        alert.type === 'critical' ? "bg-red-50 text-red-700 border-red-100" :
                                            alert.type === 'high' ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                    )}>
                                        {alert.type}
                                    </span>
                                    <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{alert.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{alert.description}</p>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        {alert.customer && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-white shadow-sm" title={alert.customer}>
                                                {alert.customer.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-[10px] text-gray-400 font-medium">{alert.timestamp}</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" title="Action Required" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-4 max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        Alert Command Center
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time threat monitoring and incident response</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('board')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            viewMode === 'board' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <Columns className="w-4 h-4" /> Board
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            viewMode === 'list' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                </div>
            </div>

            {/* Board View */}
            {viewMode === 'board' && (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                    <StatusLane
                        title="New Arrivals"
                        alerts={mockAlerts.filter(a => a.status === 'new')}
                    />
                    <StatusLane
                        title="Under Investigation"
                        alerts={mockAlerts.filter(a => a.status === 'investigating')}
                    />
                    <StatusLane
                        title="Resolved / Closed"
                        alerts={mockAlerts.filter(a => a.status === 'resolved')}
                    />
                </div>
            )}

            {/* List View Placeholder (reusing previous logic but simplified for brevity in this interaction) */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                    <List className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>List view is currently optimized for bulk actions.</p>
                </div>
            )}
        </div>
    );
};

export default AlertManagement;
