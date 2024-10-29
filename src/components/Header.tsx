import React from 'react'
import { BarChart3, Users, Package } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clerk Group Sales Report</h1>
            <p className="text-sm text-gray-500 mt-1">December 2024</p>
          </div>
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Revenue
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Users className="h-4 w-4 mr-2" />
              Staff
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Package className="h-4 w-4 mr-2" />
              Products
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}