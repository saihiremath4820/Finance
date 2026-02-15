import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    Users,
    Search,
    PieChart,
    Settings,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    LayoutTemplate,
    LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const navItems = [
        { icon: BarChart3, label: 'Executive Overview', path: '/' },
        { icon: Search, label: 'Risk Monitoring', path: '/monitoring' },
        { icon: Users, label: 'Customer Profiles', path: '/customer/CU789456' }, // Default to a demo customer
        { icon: ShieldAlert, label: 'Alerts', path: '/alerts' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: LayoutTemplate, label: 'Broker Portal', path: '/broker' },
        { icon: Users, label: 'Customer Portal', path: '/customer-portal' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className={cn(
            "bg-white border-right border-gray-200 h-screen transition-all duration-300 flex flex-col sticky top-0 border-r",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-barclays-blue p-2 rounded-lg">
                    <ShieldAlert className="text-white w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">PRE-DELINQUENCY</span>
                        <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Intervention Engine</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                            isActive
                                ? "bg-blue-50 text-barclays-blue"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            isCollapsed && "mx-auto"
                        )} />
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{item.label}</span>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
                <NavLink
                    to="/login"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="font-semibold text-sm">Sign Out</span>}
                </NavLink>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                >
                    {isCollapsed ? <ChevronRight /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-semibold">Collapse Sidebar</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
