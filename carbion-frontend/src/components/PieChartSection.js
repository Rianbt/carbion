import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definindo as cores para as células do gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BE0', '#FF5D9E'];

export default function PieChartSection({ chartData }) {
    // Componente JSX convertido para JavaScript (React.createElement)
    return React.createElement(
        ResponsiveContainer,
        { width: '100%', height: 300 },
        React.createElement(
            PieChart,
            null,
            React.createElement(
                Pie,
                {
                    data: chartData,
                    cx: '50%',
                    cy: '50%',
                    labelLine: false,
                    outerRadius: 100,
                    fill: '#8884d8',
                    dataKey: 'value'
                },
                chartData.map((entry, index) =>
                    React.createElement(Cell, {
                        key: `cell-${index}`,
                        fill: COLORS[index % COLORS.length]
                    })
                )
            ),
            React.createElement(Tooltip, null),
            React.createElement(Legend, null)
        )
    );
}
