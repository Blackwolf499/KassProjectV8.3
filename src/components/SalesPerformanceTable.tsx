import React from 'react';
import { useUpload } from '../context/UploadContext';

export function SalesPerformanceTable() {
  const { state } = useUpload();
  const { extractedData } = state;

  const calculateTotalItems = (transactions: any[] = []) => {
    return transactions.length;
  };

  const calculateAvgPerItem = (totalSales: number, transactions: any[] = []) => {
    const totalItems = calculateTotalItems(transactions);
    return totalItems > 0 ? totalSales / totalItems : 0;
  };

  const staffData = React.useMemo(() => {
    if (!extractedData?.financials?.byMember) return [];

    return extractedData.financials.byMember
      .map(member => {
        const memberInfo = extractedData.members?.find(m => m.id === member.memberId);
        return {
          id: member.memberId,
          name: memberInfo?.name || 'Unknown',
          totalSales: member.totalSales || 0,
          transactions: member.transactions || []
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [extractedData]);

  if (!extractedData) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Staff Sales Performance Report</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          Upload a document to view staff performance data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Staff Sales Performance Report</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items Sold
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sales
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg per Item
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffData.map((clerk) => (
              <tr key={clerk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{clerk.name}</div>
                      <div className="text-sm text-gray-500">ID: {clerk.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {calculateTotalItems(clerk.transactions).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  ${clerk.totalSales.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  ${calculateAvgPerItem(clerk.totalSales, clerk.transactions).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                {staffData.reduce((sum, clerk) => sum + calculateTotalItems(clerk.transactions), 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                ${staffData.reduce((sum, clerk) => sum + clerk.totalSales, 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                ${staffData.length > 0 ? (
                  staffData.reduce((sum, clerk) => sum + clerk.totalSales, 0) / 
                  staffData.reduce((sum, clerk) => sum + calculateTotalItems(clerk.transactions), 0)
                ).toFixed(2) : '0.00'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}