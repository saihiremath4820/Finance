import React, { useState } from 'react';
import { Save, Bell, Shield, User, Sliders, Database } from 'lucide-react';
import { cn } from '../utils/utils';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Sliders },
        { id: 'risk-models', label: 'Risk Models', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'data-sources', label: 'Data Sources', icon: Database },
        { id: 'account', label: 'Account', icon: User },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium">Manage alerts, risk thresholds, and system preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                                    activeTab === tab.id
                                        ? "bg-white text-brand-blue-500 shadow-sm ring-1 ring-gray-200"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-brand-blue-500" : "text-gray-400")} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                    {/* Placeholder Content for Demo */}
                    <div className="max-w-2xl space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Risk Threshold Configuration</h2>
                            <p className="text-sm text-gray-500">Define the score ranges for automatic risk categorization.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Critical Risk Threshold</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            defaultValue={80}
                                            className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-semibold"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                                    </div>
                                    <p className="text-xs text-red-500 font-medium">Scores above this trigger immediate intervention alerts.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">High Risk Threshold</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            defaultValue={60}
                                            className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">EESS Data Integration</h3>
                                        <p className="text-xs text-gray-500 mt-1">Include external economic stress signals in risk scoring.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue-500"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Auto-Intervention Mode</h3>
                                        <p className="text-xs text-gray-500 mt-1">Automatically schedule interventions for 95+ risk scores.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <button className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue-500 text-white rounded-lg text-sm font-bold hover:bg-brand-blue-600 transition-colors shadow-lg shadow-brand-blue-500/20">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
