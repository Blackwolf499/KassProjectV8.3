import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { FileHistory } from '../types';

interface DataVisualizationProps {
  history: FileHistory[];
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ history }) => {
  if (history.length === 0) return null;

  const chartData = history
    .slice()
    .reverse()
    .map(item => ({
      name: new Date(item.timestamp).toLocaleDateString(),
      totalSales: item.extractedData.financials.totalSales,
      totalRevenue: item.extractedData.financials.summary.totalRevenue,
      transactions: item.extractedData.financials.transactions.length,
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Data Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              yAxisId="left"
              fontSize={12}
              tick={{ fill: '#6B7280' }}
              label={{ 
                value: 'Amount ($)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#6B7280' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              fontSize={12}
              tick={{ fill: '#6B7280' }}
              label={{ 
                value: 'Transaction Count', 
                angle: 90, 
                position: 'insideRight',
                style: { fill: '#6B7280' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalSales"
              name="Total Sales"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalRevenue"
              name="Total Revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="transactions"
              name="Transaction Count"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};