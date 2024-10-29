import React, { useState, useMemo } from 'react';
import { TimelineView } from './TimelineView';
import { AnalyticsFilters } from './AnalyticsFilters';
import { TrendChart } from './TrendChart';
import { SearchBar } from './SearchBar';
import { metrics, staffData, revenueData } from '../data/mockData';

export function HistoricalAnalysis() {
  const [dateRange, setDateRange] = useState({ start: new Date(2024, 0, 1), end: new Date() });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'sales', 'orders']);
  
  const filteredData = useMemo(() => {
    return revenueData.filter(item => {
      const itemDate = new Date(2024, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month), 1);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });
  }, [dateRange]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Historical Analysis</h2>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <AnalyticsFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedMetrics={selectedMetrics}
        onMetricsChange={setSelectedMetrics}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={filteredData} metrics={selectedMetrics} />
        <TimelineView data={filteredData} searchQuery={searchQuery} />
      </div>
    </div>
  );
}