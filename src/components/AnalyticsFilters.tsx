import React from 'react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface AnalyticsFiltersProps {
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  selectedMetrics,
  onMetricsChange,
}: AnalyticsFiltersProps) {
  const metrics = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'sales', label: 'Sales' },
    { id: 'orders', label: 'Orders' },
    { id: 'customers', label: 'Customers' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => onDateRangeChange({
              ...dateRange,
              start: new Date(e.target.value)
            })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => onDateRangeChange({
              ...dateRange,
              end: new Date(e.target.value)
            })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <label
                key={metric.id}
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onMetricsChange([...selectedMetrics, metric.id]);
                    } else {
                      onMetricsChange(selectedMetrics.filter(m => m !== metric.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}