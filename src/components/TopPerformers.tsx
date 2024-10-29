import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface TopPerformersProps {
  data: Array<{
    name: string
    total_sales: number
    items: Array<{
      food_name: string
      quantity: number
    }>
  }>
}

export function TopPerformers({ data }: TopPerformersProps) {
  const sortedStaff = [...data].sort((a, b) => b.total_sales - a.total_sales)
  const totalItems = (items: any[]) => items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Rankings</h2>
      <div className="space-y-4">
        {sortedStaff.map((staff, index) => (
          <div key={staff.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </span>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{staff.name}</h3>
                <p className="text-sm text-gray-500">{totalItems(staff.items)} items sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">${staff.total_sales}</p>
              <p className="text-sm text-gray-500">Total Sales</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}