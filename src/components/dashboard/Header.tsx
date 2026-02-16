import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search customers, signals, or sectors..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-barclays-blue/20 focus:border-barclays-blue transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    SYSTEM LIVE: FEB 15, 2026
                </div>

                <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900">Anjali Sharma</span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Senior Risk Manager</span>
                    </div>
                    <div className="w-10 h-10 bg-barclays-blue/10 rounded-xl flex items-center justify-center text-barclays-blue border border-barclays-blue/20">
                        <User className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
