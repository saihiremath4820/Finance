import React from 'react';
import type { Customer } from '../../types';
import RiskBadge from '../common/RiskBadge';
import { Calendar, Mail, Phone, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/utils';

interface CustomerProfileHeaderProps {
    customer: Customer;
}

const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({ customer }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-barclays-blue/10 rounded-2xl flex items-center justify-center text-barclays-blue border border-barclays-blue/20">
                        <User className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">{customer.id}</span>
                            <RiskBadge score={customer.riskScore} level={customer.riskLevel} size="md" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Since {customer.accountSince}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                {customer.name.toLowerCase().replace(' ', '.')}@example.com
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4" />
                                +91 98765-43210
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 lg:border-l lg:border-gray-100 lg:pl-8">
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Risk Score</div>
                        <div className={cn(
                            "text-5xl font-black mb-1",
                            customer.riskScore >= 80 ? "text-red-600" :
                                customer.riskScore >= 60 ? "text-orange-600" :
                                    customer.riskScore >= 40 ? "text-yellow-600" : "text-blue-600"
                        )}>
                            {customer.riskScore}
                        </div>
                        <div className={cn(
                            "flex items-center justify-center gap-1 text-xs font-bold",
                            customer.trend === 'up' ? "text-red-500" : customer.trend === 'down' ? "text-green-500" : "text-gray-400"
                        )}>
                            {customer.trend === 'up' ? <TrendingUp size={14} /> : customer.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                            {customer.trend === 'up' ? '+15 pts' : customer.trend === 'down' ? '-8 pts' : 'Stable'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship Manager</span>
                            <span className="text-sm font-bold text-gray-900">Priya Mehta</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employer</span>
                            <span className="text-sm font-bold text-gray-900">{customer.employer} ({customer.sector})</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {customer.products.map((product, i) => (
                    <div key={i} className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.type.replace('_', ' ')}</span>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900">
                                ₹{product.amount ? (product.amount / 100000).toFixed(1) + 'L' : (product.balance! / 1000).toFixed(1) + 'K'}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                {product.type === 'savings' ? 'Current Balance' : `EMI: ₹${product.emi?.toLocaleString()}/mo`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerProfileHeader;
