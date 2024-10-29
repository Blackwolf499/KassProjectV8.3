import { DashboardData } from '../types'
import { metrics, staffData, productsData, revenueData } from '../data/mockData'

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    metrics,
    staff: staffData,
    products: productsData,
    revenue: revenueData
  }
}