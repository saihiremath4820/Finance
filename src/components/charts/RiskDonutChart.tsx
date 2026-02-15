import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskData {
    name: string;
    value: number;
    color: string;
}

interface RiskDonutChartProps {
    data: RiskData[];
}

const RiskDonutChart: React.FC<RiskDonutChartProps> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        itemStyle={{ color: '#111827', fontWeight: 600, fontSize: '13px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{total.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Total Risk</div>
            </div>
        </div>
    );
};

export default RiskDonutChart;
