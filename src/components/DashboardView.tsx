import React from 'react';
import { SalesPerformanceTable } from './SalesPerformanceTable';
import { StaffPerformanceChart } from './StaffPerformanceChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TopPerformers } from './TopPerformers';
import { ExecutiveSummary } from './ExecutiveSummary';

interface StaffData {
  clerks: Array<{
    clerk_id: string
    name: string
    total_sales: number
    items: Array<{
      code: number
      food_name: string
      quantity: number
    }>
  }>
}

export function DashboardView() {
  const mockData: StaffData = {
    clerks: [
      {
        "clerk_id": "000-016",
        "name": "Emily",
        "total_sales": 2023.0,
        "items": [
          { "code": 40, "food_name": "Main Dish", "quantity": 94.0 },
          { "code": 28, "food_name": "Desserts", "quantity": 57.0 },
          { "code": 29, "food_name": "Burgers", "quantity": 84.0 },
          { "code": 26, "food_name": "Sides", "quantity": 210.0 },
          { "code": 27, "food_name": "Steak", "quantity": 170.0 },
          { "code": 19, "food_name": "Hot Beverages", "quantity": 81.0 },
          { "code": 12, "food_name": "Red Wine", "quantity": 291.0 },
          { "code": 13, "food_name": "White Wine", "quantity": 117.0 }
        ]
      },
      // ... rest of the mock data
    ]
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <ExecutiveSummary />
        <SalesPerformanceTable data={mockData.clerks} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaffPerformanceChart data={mockData.clerks} />
          <CategoryBreakdown data={mockData.clerks} />
        </div>
        <TopPerformers data={mockData.clerks} />
      </div>
    </main>
  );
}