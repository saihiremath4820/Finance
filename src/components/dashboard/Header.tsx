import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="h-16 bg-brand-blue-500 px-6 flex items-center justify-between sticky top-0 z-40 text-white">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search customers, signals, or sectors..."
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">


                <button className="relative p-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-brand-blue-500" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold">Anjali Sharma</span>
                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Senior Risk Manager</span>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                        <User className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
