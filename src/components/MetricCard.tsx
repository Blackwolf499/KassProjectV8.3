import React from 'react'
import { ArrowTrendingUpIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/outline'

interface MetricCardProps {
  title: string
  value: string
  change: number
}

export function MetricCard({ title, value, change }: MetricCardProps) {
  const getIcon = () => {
    switch (title) {
      case 'Total Revenue':
        return <BanknotesIcon className="h-5 w-5 text-gray-400" />
      case 'Total Sales':
        return <ChartBarIcon className="h-5 w-5 text-gray-400" />
      default:
        return <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {getIcon()}
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className={`mt-2 flex items-center text-sm ${
        change >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        <span>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  )
}