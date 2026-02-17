import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
    { day: 'Mon', holiday: 70, restructuring: 60, counseling: 75, extension: 85 },
    { day: 'Tue', holiday: 72, restructuring: 62, counseling: 77, extension: 87 },
    { day: 'Wed', holiday: 75, restructuring: 61, counseling: 79, extension: 89 },
    { day: 'Thu', holiday: 73, restructuring: 64, counseling: 81, extension: 90 },
    { day: 'Fri', holiday: 78, restructuring: 63, counseling: 80, extension: 91 },
    { day: 'Sat', holiday: 77, restructuring: 65, counseling: 83, extension: 92 },
    { day: 'Sun', holiday: 78, restructuring: 64, counseling: 82, extension: 91 },
];

const InterventionChart: React.FC = () => {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorExtension" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCounseling" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2C83B9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2C83B9" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                        domain={[50, 100]}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                    <Area
                        type="monotone"
                        dataKey="extension"
                        name="Grace Period"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExtension)"
                    />
                    <Area
                        type="monotone"
                        dataKey="counseling"
                        name="Counseling"
                        stroke="#2C83B9"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCounseling)"
                    />
                    <Area
                        type="monotone"
                        dataKey="holiday"
                        name="Payment Holiday"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="none"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InterventionChart;
