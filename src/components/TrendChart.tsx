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
import { RevenueData } from '../types';

interface TrendChartProps {
  data: RevenueData[];
  metrics: string[];
}

export function TrendChart({ data, metrics }: TrendChartProps) {
  const colors = {
    revenue: '#3b82f6',
    target: '#9ca3af',
    sales: '#10b981',
    orders: '#6366f1'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend />
            {metrics.includes('revenue') && (
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={colors.revenue}
                name="Revenue"
                strokeWidth={2}
              />
            )}
            {metrics.includes('revenue') && (
              <Line
                type="monotone"
                dataKey="target"
                stroke={colors.target}
                name="Target"
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}