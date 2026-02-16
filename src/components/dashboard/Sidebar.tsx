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
    const [isCollapsed, setIsCollapsed] = React.useState(true); // Default to collapsed as requested
    const timeoutRef = React.useRef<number | null>(null);

    // Handler to expand on hover with debounce
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Small delay to prevent accidental triggers
        timeoutRef.current = window.setTimeout(() => {
            setIsCollapsed(false);
        }, 100);
    };

    // Handler to collapse on mouse leave with debounce
    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Delay before collapsing to make it feel smoother
        timeoutRef.current = window.setTimeout(() => {
            setIsCollapsed(true);
        }, 300);
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
                "bg-white border-right border-gray-200 h-screen flex flex-col sticky top-0 border-r transition-all duration-300 z-50",
                isCollapsed ? "w-20 min-w-[5rem]" : "w-64 min-w-[16rem]"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Hexagon Outline */}
                        <path d="M50 8L88 28V72L50 92L12 72V28L50 8Z" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Solid Bars */}
                        <rect x="25" y="60" width="12" height="25" fill="black" />
                        <rect x="44" y="45" width="12" height="40" fill="black" />
                        <rect x="63" y="20" width="12" height="65" fill="black" />

                        {/* Curved Growth Arrow - Swoosh */}
                        <path d="M12 78 C 45 65 65 45 80 18" stroke="#FFA500" strokeWidth="8" strokeLinecap="round" fill="none" />
                        {/* Arrow Head */}
                        <path d="M60 18 L80 18 L80 38" stroke="#FFA500" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>
                <div className={cn(
                    "flex flex-col transition-opacity duration-300",
                    isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-[#1F4788] text-2xl leading-none tracking-tight">FinGuard</span>
                    </div>
                    <span className="text-[#4A90E2] text-sm font-semibold tracking-wide leading-none">AI</span>
                </div>
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
                        <item.icon className={cn("w-5 h-5 shrink-0", isCollapsed && "mx-auto")} />
                        <div className={cn(
                            "flex flex-col transition-all duration-300 overflow-hidden",
                            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        )}>
                            <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                        </div>
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

