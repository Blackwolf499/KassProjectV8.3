import React from 'react';
import { ArrowTrendingUpIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useUpload } from '../context/UploadContext';
import { calculateDashboardMetrics } from '../lib/metricsProcessor';

export function ExecutiveSummary() {
  const { state } = useUpload();
  const metrics = React.useMemo(() => {
    if (!state.extractedData) return null;
    return calculateDashboardMetrics(state.extractedData);
  }, [state.extractedData]);

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center text-gray-500">
          <p>Upload and process a document to view the executive summary</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const formatPercentage = (value: number) =>
    `${Math.abs(value).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue.value)}
            change={metrics.totalRevenue.change}
            icon={<BanknotesIcon className="h-5 w-5 text-gray-400" />}
          />
          <MetricCard
            title="Total Sales"
            value={metrics.totalSales.value.toLocaleString()}
            change={metrics.totalSales.change}
            icon={<ChartBarIcon className="h-5 w-5 text-gray-400" />}
          />
          <MetricCard
            title="Average Order"
            value={formatCurrency(metrics.averageOrder.value)}
            change={metrics.averageOrder.change}
            icon={<ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />}
          />
          <MetricCard
            title="Staff Performance"
            value={formatPercentage(metrics.staffPerformance.average)}
            change={0}
            icon={<ChartBarIcon className="h-5 w-5 text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <ChartBarIcon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Key Findings</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-400" />
                  <span className="ml-4 text-gray-700">
                    Overall revenue {metrics.totalRevenue.change >= 0 ? 'increased' : 'decreased'} by{' '}
                    <span className="font-semibold text-blue-700">
                      {formatPercentage(metrics.totalRevenue.change)}
                    </span>{' '}
                    compared to last month
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-400" />
                  <span className="ml-4 text-gray-700">
                    Staff performance average is{' '}
                    <span className="font-semibold text-blue-700">
                      {formatPercentage(metrics.staffPerformance.average)}
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-400" />
                  <span className="ml-4 text-gray-700">
                    {metrics.categoryPerformance.top.name} leads with{' '}
                    <span className="font-semibold text-blue-700">
                      {formatCurrency(metrics.categoryPerformance.top.revenue)}
                    </span> in sales
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-400" />
                  <span className="ml-4 text-gray-700">
                    Average order value {metrics.averageOrder.change >= 0 ? 'improved' : 'decreased'} by{' '}
                    <span className="font-semibold text-blue-700">
                      {formatPercentage(metrics.averageOrder.change)}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 rounded-lg p-2">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-green-400" />
                  <span className="ml-4 text-gray-700">
                    Focus on improving sales in underperforming categories
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-green-400" />
                  <span className="ml-4 text-gray-700">
                    {metrics.totalSales.change < 0 ? 'Address' : 'Maintain'} staff training to{' '}
                    {metrics.totalSales.change < 0 ? 'improve' : 'support'} the{' '}
                    <span className="font-semibold text-green-700">
                      {formatPercentage(metrics.totalSales.change)}
                    </span>{' '}
                    change in total sales
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-green-400" />
                  <span className="ml-4 text-gray-700">
                    Consider expanding the premium product line based on performance
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-green-400" />
                  <span className="ml-4 text-gray-700">
                    Review inventory management for top-selling items
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <div className={`mt-2 flex items-center text-sm ${
        change >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        <span>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
}