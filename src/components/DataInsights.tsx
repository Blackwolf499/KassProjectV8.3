import React from 'react';
import { LightBulbIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import type { ExtractedData } from '../types';

interface DataInsightsProps {
  data: ExtractedData;
}

export function DataInsights({ data }: DataInsightsProps) {
  const insights = React.useMemo(() => {
    const totalRevenue = data.financials.overall.totalRevenue;
    const memberCount = data.members.length;
    const averageRevenue = totalRevenue / memberCount;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        trend: 'up',
      },
      {
        title: 'Member Count',
        value: memberCount.toString(),
        trend: 'neutral',
      },
      {
        title: 'Average Revenue per Member',
        value: `$${averageRevenue.toLocaleString()}`,
        trend: averageRevenue > 1000 ? 'up' : 'down',
      },
    ];
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{insight.title}</span>
              {insight.trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
              ) : insight.trend === 'down' ? (
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
            <p className="text-lg font-semibold text-gray-900">{insight.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}