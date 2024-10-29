import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'

interface StaffMember {
  id: string
  name: string
  performance: number
  shifts: number
  salesPerShift: number
  customerRating: number
}

export const StaffAnalytics: React.FC = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'performance' | 'shifts' | 'sales'>('performance')

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch('https://res.cloudinary.com/dnxrojc7v/raw/upload/v1730022560/grill_staff_data_gpjbio.json')
        if (!response.ok) throw new Error('Failed to fetch staff data')
        const data = await response.json()
        
        // Process and enhance the data
        const enhancedData = data.map((staff: any) => ({
          ...staff,
          salesPerShift: Math.round(staff.totalSales / staff.shifts),
          customerRating: (Math.random() * 2 + 3).toFixed(1) // Random rating between 3-5
        }))
        
        setStaffData(enhancedData)
      } catch (err) {
        setError('Failed to load staff data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStaffData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const getChartData = () => {
    switch (viewMode) {
      case 'performance':
        return {
          data: staffData,
          dataKey: 'performance',
          fill: '#3b82f6',
          name: 'Performance Score'
        }
      case 'shifts':
        return {
          data: staffData,
          dataKey: 'shifts',
          fill: '#10b981',
          name: 'Total Shifts'
        }
      case 'sales':
        return {
          data: staffData,
          dataKey: 'salesPerShift',
          fill: '#6366f1',
          name: 'Sales per Shift'
        }
      default:
        return {
          data: staffData,
          dataKey: 'performance',
          fill: '#3b82f6',
          name: 'Performance Score'
        }
    }
  }

  const chartConfig = getChartData()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Staff Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('performance')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'performance'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setViewMode('shifts')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'shifts'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Shifts
          </button>
          <button
            onClick={() => setViewMode('sales')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'sales'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Sales/Shift
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartConfig.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={chartConfig.dataKey}
              fill={chartConfig.fill}
              name={chartConfig.name}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Average Performance</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-900">
            {(staffData.reduce((acc, curr) => acc + curr.performance, 0) / staffData.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Total Shifts</h3>
          <p className="mt-2 text-2xl font-semibold text-green-900">
            {staffData.reduce((acc, curr) => acc + curr.shifts, 0)}
          </p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-700">Avg Sales/Shift</h3>
          <p className="mt-2 text-2xl font-semibold text-indigo-900">
            ${(staffData.reduce((acc, curr) => acc + curr.salesPerShift, 0) / staffData.length).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  )
}