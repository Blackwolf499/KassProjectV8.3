import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useUpload } from '../context/UploadContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C43'];

export function CategoryBreakdown() {
  const { state } = useUpload();
  const { extractedData } = state;

  const categoryData = useMemo(() => {
    if (!extractedData?.financials?.byMember) {
      return [];
    }

    // Get all unique transaction types
    const categories = new Set<string>();
    extractedData.financials.byMember.forEach(member => {
      member.transactions.forEach(transaction => {
        if (transaction.type) {
          categories.add(transaction.type);
        }
      });
    });

    // Calculate equal percentage for each category
    const categoryCount = categories.size || 1;
    const equalPercentage = (100 / categoryCount).toFixed(1);

    // Create data array with equal distribution
    return Array.from(categories).map(category => ({
      name: category,
      value: Number(equalPercentage)
    }));
  }, [extractedData]);

  if (!categoryData.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Sales Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${value}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}