import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    Users,
    Search,
    PieChart,
    Settings,
    ShieldAlert,
    LayoutTemplate,
    LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const timeoutRef = React.useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsCollapsed(false), 100);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsCollapsed(true), 300);
    };

    const navItems = [
        { icon: BarChart3, label: 'Executive Overview', path: '/' },
        { icon: Search, label: 'Risk Monitoring', path: '/monitoring' },
        { icon: Users, label: 'Customer Profiles', path: '/customer/CU789456' },
        { icon: ShieldAlert, label: 'Alerts', path: '/alerts' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: LayoutTemplate, label: 'Broker Portal', path: '/broker' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside
            className={cn(
                "bg-brand-blue-500 h-screen flex flex-col sticky top-0 transition-all duration-300 z-50 text-white",
                isCollapsed ? "w-20 min-w-[5rem]" : "w-64 min-w-[16rem]"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Hexagon Outline - Matched Image Design */}
                        <path d="M50 8 L90 28 V72 L50 92 L10 72 V28 Z" stroke="white" strokeWidth="8" strokeLinejoin="round" />

                        {/* Vertical Bars - Matched Image Design */}
                        <rect x="28" y="58" width="10" height="15" fill="white" />
                        <rect x="45" y="40" width="10" height="33" fill="white" />
                        <rect x="62" y="15" width="10" height="58" fill="white" />

                        {/* Thick Orange Arrow - Matched Image Design */}
                        <path d="M12 78 Q 45 74 85 18" stroke="#ffa314" strokeWidth="11" strokeLinecap="round" fill="none" />
                        <path d="M72 18 L88 18 L88 34" stroke="#ffa314" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>
                <div className={cn(
                    "flex flex-col transition-opacity duration-300",
                    isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-white text-2xl leading-none tracking-tight">TrustVault</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-0 mt-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-4 px-6 py-4 transition-all group relative border-l-4",
                            isActive
                                ? "bg-white/10 text-white font-bold border-brand-orange-500"
                                : "text-white/80 hover:bg-white/5 hover:text-white border-transparent"
                        )}
                    >
                        <item.icon className={cn(
                            "w-6 h-6 shrink-0 transition-transform group-hover:scale-110",
                            "text-brand-orange-500", // "Attracting" color
                            isCollapsed && "mx-auto"
                        )} />
                        <div className={cn(
                            "flex flex-col transition-all duration-300 overflow-hidden",
                            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        )}>
                            <span className="text-sm font-semibold whitespace-nowrap tracking-wide">{item.label}</span>
                        </div>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/20 flex flex-col gap-2">
                <NavLink
                    to="/login"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className={cn(
                        "font-semibold text-sm whitespace-nowrap transition-all duration-300",
                        isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                    )}>Sign Out</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;