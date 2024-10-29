import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDownIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface ClerkData {
  clerk_id: string;
  name: string;
  total_sales: number;
  items: Array<{
    code: number;
    food_name: string;
    quantity: number;
  }>;
}

interface PerformanceData {
  date: string;
  sales: number;
  items: number;
  avgOrderValue: number;
}

interface ClerkPerformanceHistoryProps {
  data: ClerkData[];
}

export function ClerkPerformanceHistory({ data }: ClerkPerformanceHistoryProps) {
  const [selectedClerk, setSelectedClerk] = useState<string>('all');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [metric, setMetric] = useState<'sales' | 'items' | 'avgOrderValue'>('sales');

  // Generate mock historical data for demonstration
  const historicalData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      date: month,
      sales: Math.floor(Math.random() * 3000) + 1000,
      items: Math.floor(Math.random() * 200) + 50,
      avgOrderValue: Math.floor(Math.random() * 50) + 20,
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (selectedClerk === 'all') return historicalData;
    return historicalData.map(item => ({
      ...item,
      sales: item.sales * 0.3,
      items: item.items * 0.3,
    }));
  }, [selectedClerk, historicalData]);

  const getMetricLabel = (metricKey: string) => {
    switch (metricKey) {
      case 'sales': return 'Total Sales ($)';
      case 'items': return 'Items Sold';
      case 'avgOrderValue': return 'Average Order Value ($)';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Clerk Performance History</h2>
          <div className="flex space-x-4">
            {/* Time Frame Filter */}
            <div className="relative">
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Clerk Filter */}
            <div className="relative">
              <select
                value={selectedClerk}
                onChange={(e) => setSelectedClerk(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Clerks</option>
                {data.map((clerk) => (
                  <option key={clerk.clerk_id} value={clerk.clerk_id}>
                    {clerk.name}
                  </option>
                ))}
              </select>
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Metric Filter */}
            <div className="relative">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as 'sales' | 'items' | 'avgOrderValue')}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sales">Sales</option>
                <option value="items">Items Sold</option>
                <option value="avgOrderValue">Avg Order Value</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  metric === 'sales' || metric === 'avgOrderValue'
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString(),
                  getMetricLabel(metric)
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#3b82f6"
                strokeWidth={2}
                name={getMetricLabel(metric)}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Total Sales</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-900">
              ${filteredData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-blue-600">
              {timeFrame} average: ${Math.floor(
                filteredData.reduce((sum, item) => sum + item.sales, 0) / filteredData.length
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Total Items</h3>
            <p className="mt-2 text-2xl font-semibold text-green-900">
              {filteredData.reduce((sum, item) => sum + item.items, 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-green-600">
              {timeFrame} average: {Math.floor(
                filteredData.reduce((sum, item) => sum + item.items, 0) / filteredData.length
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Average Order Value</h3>
            <p className="mt-2 text-2xl font-semibold text-purple-900">
              ${Math.floor(
                filteredData.reduce((sum, item) => sum + item.avgOrderValue, 0) / filteredData.length
              ).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-purple-600">
              {timeFrame} trend: {
                filteredData[filteredData.length - 1].avgOrderValue > filteredData[0].avgOrderValue
                  ? '↑ Increasing'
                  : '↓ Decreasing'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}