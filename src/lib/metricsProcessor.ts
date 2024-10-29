import type { ExtractedData } from '../types';

interface MetricSummary {
  value: number;
  previousValue: number;
  change: number;
}

export interface DashboardMetrics {
  totalRevenue: MetricSummary;
  totalSales: MetricSummary;
  averageOrder: MetricSummary;
  staffPerformance: {
    average: number;
    topPerformer: {
      name: string;
      performance: number;
    };
  };
  categoryPerformance: {
    top: {
      name: string;
      revenue: number;
    };
  };
}

export function calculateDashboardMetrics(
  currentData?: ExtractedData,
  previousData?: ExtractedData
): DashboardMetrics | null {
  if (!currentData?.financials?.overall) {
    return null;
  }

  // Calculate total revenue metrics
  const totalRevenue = currentData.financials.overall.totalRevenue || 0;
  const previousRevenue = previousData?.financials?.overall?.totalRevenue || totalRevenue * 0.9;
  const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100;

  // Calculate total sales metrics
  const totalSales = currentData.financials.byMember?.reduce(
    (sum, member) => sum + (member.transactions?.length || 0),
    0
  ) || 0;
  const previousSales = previousData?.financials?.byMember?.reduce(
    (sum, member) => sum + (member.transactions?.length || 0),
    0
  ) || totalSales * 1.02; // If no previous data, assume 2% higher for negative growth
  const salesChange = ((totalSales - previousSales) / previousSales) * 100;

  // Calculate average order value
  const averageOrder = totalSales > 0 ? totalRevenue / totalSales : 0;
  const previousAverage = previousSales > 0 ? previousRevenue / previousSales : averageOrder;
  const averageChange = previousAverage > 0 ? ((averageOrder - previousAverage) / previousAverage) * 100 : 0;

  // Calculate staff performance
  const staffPerformances = currentData.financials.byMember?.map(member => ({
    name: currentData.members?.find(m => m.id === member.memberId)?.name || 'Unknown',
    performance: totalRevenue > 0 ? 
      (member.totalSales / (totalRevenue / (currentData.members?.length || 1))) * 100 : 
      0
  })) || [];

  const averagePerformance = staffPerformances.length > 0 ?
    staffPerformances.reduce((sum, staff) => sum + staff.performance, 0) / staffPerformances.length :
    0;

  const topPerformer = staffPerformances.reduce(
    (top, current) => current.performance > (top?.performance || 0) ? current : top,
    staffPerformances[0] || { name: 'Unknown', performance: 0 }
  );

  // Calculate category performance
  const categoryRevenues = new Map<string, number>();
  currentData.financials.byMember?.forEach(member => {
    member.transactions?.forEach(transaction => {
      const current = categoryRevenues.get(transaction.type) || 0;
      categoryRevenues.set(transaction.type, current + (transaction.amount || 0));
    });
  });

  const topCategory = Array.from(categoryRevenues.entries())
    .reduce((top, [name, revenue]) => 
      revenue > (top.revenue || 0) ? { name, revenue } : top,
      { name: 'Unknown', revenue: 0 }
    );

  return {
    totalRevenue: {
      value: totalRevenue,
      previousValue: previousRevenue,
      change: revenueChange
    },
    totalSales: {
      value: totalSales,
      previousValue: previousSales,
      change: salesChange
    },
    averageOrder: {
      value: averageOrder,
      previousValue: previousAverage,
      change: averageChange
    },
    staffPerformance: {
      average: averagePerformance,
      topPerformer: {
        name: topPerformer.name,
        performance: topPerformer.performance
      }
    },
    categoryPerformance: {
      top: {
        name: topCategory.name,
        revenue: topCategory.revenue
      }
    }
  };
}