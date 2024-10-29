import React from 'react';
import { DollarSign, User, FileText } from 'lucide-react';
import type { ExtractedData } from '../types';

interface ResultDisplayProps {
  data: ExtractedData | null;
}

export function ResultDisplay({ data }: ResultDisplayProps) {
  if (!data) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {data.members && data.members.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Members</h3>
            </div>
            <div className="space-y-2">
              {data.members.map((member, index) => (
                <div key={index} className="p-2 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{member.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.financials && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="font-medium">${data.financials.overall.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium">${data.financials.overall.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}