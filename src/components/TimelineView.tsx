import React from 'react';
import { RevenueData } from '../types';

interface TimelineViewProps {
  data: RevenueData[];
  searchQuery: string;
}

export function TimelineView({ data, searchQuery }: TimelineViewProps) {
  const filteredData = data.filter(item =>
    item.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
      <div className="space-y-4">
        {filteredData.map((item, index) => (
          <div
            key={item.month}
            className="relative pl-8 pb-4 border-l-2 border-blue-200 last:border-l-0"
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500" />
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{item.month}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  item.revenue >= item.target
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.revenue >= item.target ? 'Above Target' : 'Below Target'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-lg font-semibold">${item.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="text-lg font-semibold">${item.target.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}