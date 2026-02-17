import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCustomers } from '../data/mockCustomers';
import type { Customer } from '../types';
import RiskBadge from '../components/common/RiskBadge';
import SignalBadge from '../components/common/SignalBadge';
import Button from '../components/common/Button';
import { cn } from '../utils/utils';

const columnHelper = createColumnHelper<Customer>();

const RiskMonitoring: React.FC = () => {
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState<string>('all');
    const [sectorFilter, setSectorFilter] = useState<string>('all');

    const data = useMemo(() => {
        let filtered = [...mockCustomers];
        if (riskFilter !== 'all') {
            filtered = filtered.filter(c => c.riskLevel === riskFilter);
        }
        if (sectorFilter !== 'all') {
            filtered = filtered.filter(c => c.sector === sectorFilter);
        }
        return filtered;
    }, [riskFilter, sectorFilter]);

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'Customer ID',
            cell: info => <span className="font-mono text-xs font-bold text-gray-500">{info.getValue()}</span>,
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => <span className="font-bold text-gray-900">{info.getValue()}</span>,
        }),
        columnHelper.accessor('riskScore', {
            header: 'Risk Score',
            cell: info => (
                <div className="flex flex-col gap-1">
                    <RiskBadge score={info.getValue()} level={info.row.original.riskLevel} size="sm" />
                </div>
            ),
        }),
        columnHelper.accessor('trend', {
            header: 'Trend',
            cell: info => {
                const trend = info.getValue();
                return (
                    <div className={cn(
                        "flex items-center gap-1 font-bold text-xs",
                        trend === 'up' ? "text-red-500" : trend === 'down' ? "text-green-500" : "text-gray-400"
                    )}>
                        {trend === 'up' ? <ArrowUp size={14} /> : trend === 'down' ? <ArrowDown size={14} /> : null}
                        <span className="capitalize">{trend}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('signals', {
            header: 'Signals',
            cell: info => (
                <div className="flex gap-1.5">
                    {info.getValue().slice(0, 3).map((signal, i) => (
                        <SignalBadge key={i} type={signal.type} severity={signal.severity} tooltip={signal.value} />
                    ))}
                    {info.getValue().length > 3 && (
                        <span className="text-[10px] text-gray-400 font-bold">+{info.getValue().length - 3}</span>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('daysToDefault', {
            header: 'Default In',
            cell: info => (
                <span className={cn(
                    "font-bold",
                    info.getValue() <= 15 ? "text-red-600" : "text-gray-700"
                )}>
                    {info.getValue()} days
                </span>
            ),
        }),
        columnHelper.accessor('sector', {
            header: 'Sector',
            cell: info => <span className="text-gray-500 font-medium text-xs">{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex items-center gap-2">
                    <Button
                        variant={info.row.original.riskLevel === 'critical' ? 'danger' : 'primary'}
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle intervention
                        }}
                    >
                        {info.row.original.riskLevel === 'critical' ? 'Intervene' : 'Schedule'}
                    </Button>
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/${info.row.original.id}`);
                        }}
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            ),
        }),
    ], [navigate]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Risk Monitoring</h1>
                    <p className="text-gray-500 font-medium">Identify and manage high-risk exposures across your portfolio</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="gap-2">
                        <RefreshCw size={16} /> Refresh
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                    <Filter size={18} className="text-brand-blue-500" />
                    <h2>Advanced Filters</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder="Name or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Risk Level</label>
                        <select
                            value={riskFilter}
                            onChange={e => setRiskFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20"
                        >
                            <option value="all">All Risks</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sector</label>
                        <select
                            value={sectorFilter}
                            onChange={e => setSectorFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20"
                        >
                            <option value="all">All Sectors</option>
                            <option value="IT Services">IT Services</option>
                            <option value="Finance/Banking">Finance</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Retail">Retail</option>
                        </select>
                    </div>

                    <div className="flex items-end pb-0.5">
                        <button
                            onClick={() => {
                                setRiskFilter('all');
                                setSectorFilter('all');
                                setGlobalFilter('');
                            }}
                            className="text-xs font-bold text-brand-blue-500 hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ArrowUp size={12} className="text-brand-blue-500" />,
                                                    desc: <ArrowDown size={12} className="text-brand-blue-500" />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-brand-blue-50/30 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/customer/${row.original.id}`)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="text-xs font-medium text-gray-500">
                        Showing <span className="text-gray-900 font-bold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="text-gray-900 font-bold">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}</span> of <span className="text-gray-900 font-bold">{data.length}</span> customers
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <div className="flex items-center gap-1">
                            {[...Array(table.getPageCount())].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => table.setPageIndex(i)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                        table.getState().pagination.pageIndex === i
                                            ? "bg-brand-blue-500 text-white shadow-md shadow-brand-blue-500/20"
                                            : "text-gray-500 hover:bg-gray-100"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            )).slice(0, 5)}
                            {table.getPageCount() > 5 && <span className="text-gray-400 font-bold">...</span>}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskMonitoring;
