import React, { useMemo, useState } from 'react';
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
import { Calendar, DollarSign, FileText } from 'lucide-react';
import type { FileHistory } from '../types';

interface TrendOverviewProps {
  history: FileHistory[];
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export const TrendOverview: React.FC<TrendOverviewProps> = ({ history }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const filteredData = useMemo(() => {
    const now = new Date();
    const ranges: Record<TimeRange, number> = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      'all': Infinity
    };

    return history
      .filter(item => {
        if (timeRange === 'all') return true;
        const itemDate = new Date(item.timestamp);
        return now.getTime() - itemDate.getTime() <= ranges[timeRange];
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [history, timeRange]);

  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      totalSales: item.extractedData.financials.overall.totalSales,
      totalRevenue: item.extractedData.financials.overall.totalRevenue,
      memberCount: item.extractedData.members.length,
      averageRevenue: item.extractedData.financials.overall.totalRevenue / item.extractedData.members.length
    }));
  }, [filteredData]);

  const metrics = useMemo(() => {
    if (chartData.length === 0) return null;

    const latest = chartData[chartData.length - 1];
    const earliest = chartData[0];

    const salesGrowth = ((latest.totalSales - earliest.totalSales) / earliest.totalSales) * 100;
    const revenueGrowth = ((latest.totalRevenue - earliest.totalRevenue) / earliest.totalRevenue) * 100;

    return {
      salesGrowth,
      revenueGrowth,
      totalFiles: chartData.length
    };
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Time Range:</span>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Sales Growth</span>
            </div>
            <p className={`text-lg font-semibold mt-1 ${
              metrics.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.salesGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">Revenue Growth</span>
            </div>
            <p className={`text-lg font-semibold mt-1 ${
              metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.revenueGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Total Reports</span>
            </div>
            <p className="text-lg font-semibold mt-1 text-purple-600">
              {metrics.totalFiles}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#6B7280', fontSize: 12 }}
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
              tick={{ fill: '#6B7280', fontSize: 12 }}
              label={{ 
                value: 'Members', 
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
              dataKey="memberCount"
              name="Member Count"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageRevenue"
              name="Avg Revenue/Member"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};