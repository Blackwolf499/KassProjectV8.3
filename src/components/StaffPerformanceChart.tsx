import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUpload } from '../context/UploadContext';

export function StaffPerformanceChart() {
  const { state } = useUpload();
  const { extractedData } = state;

  if (!extractedData?.financials?.byMember) {
    return null;
  }

  const chartData = extractedData.financials.byMember.map(member => {
    const memberInfo = extractedData.members?.find(m => m.id === member.memberId);
    return {
      name: memberInfo?.name || 'Unknown',
      sales: member.totalSales || 0,
      items: member.transactions?.length || 0
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance Overview</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="sales" 
              fill="#8884d8" 
              name="Total Sales" 
            />
            <Bar 
              yAxisId="right" 
              dataKey="items" 
              fill="#82ca9d" 
              name="Items Sold" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}