import React from 'react';
import { Search } from 'lucide-react';

const PremFinaHeader: React.FC = () => {
    return (
        <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-1">
                <span className="text-[28px] font-normal text-[#F15A24] tracking-tight">Prem</span>
                <span className="text-[28px] font-medium text-[#F15A24] tracking-tight">Fina</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                {['Customers', 'Brokers', 'Careers', 'About us', 'News'].map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="text-[15px] font-medium text-gray-700 hover:text-[#F15A24] transition-colors"
                    >
                        {item}
                    </a>
                ))}
            </nav>

            {/* Search */}
            <div className="relative hidden md:block w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F15A24]/20 focus:border-[#F15A24] transition-all"
                />
            </div>
        </header>
    );
};

export default PremFinaHeader;
