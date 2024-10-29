import React from 'react';
import { DollarSign, User, FileText, ArrowRight, Download } from 'lucide-react';
import type { ExtractedData, Transaction, PDFSegment } from '../types';

interface ResultDisplayProps {
  data: ExtractedData | null;
  segments?: PDFSegment[];
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center space-x-2">
      <ArrowRight className="h-4 w-4 text-gray-400" />
      <span className="text-gray-600">{transaction.type}</span>
    </div>
    <span className="font-medium">${transaction.amount.toLocaleString()}</span>
  </div>
);

const Card: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center space-x-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const downloadJson = (data: ExtractedData | PDFSegment[], filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, segments }) => {
  if (!data) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Extracted Data</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadJson(data, `extracted-data-${new Date().toISOString()}.json`)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </button>
          {segments && (
            <button
              onClick={() => downloadJson(segments, `raw-segments-${new Date().toISOString()}.json`)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Download Segments</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {data.members && data.members.length > 0 && (
          <Card 
            icon={<User className="h-5 w-5 text-blue-500" />} 
            title="Members"
          >
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
                  {member.sourceLocation && (
                    <div className="text-xs text-gray-500 mt-2">
                      Source: Page {member.sourceLocation.page}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {data.financials && (
          <Card 
            icon={<DollarSign className="h-5 w-5 text-green-500" />} 
            title="Financial Summary"
          >
            <div className="space-y-2">
              {data.financials.overall && typeof data.financials.overall.totalSales === 'number' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales:</span>
                  <span className="font-medium">${data.financials.overall.totalSales.toLocaleString()}</span>
                </div>
              )}
              {data.financials.overall && typeof data.financials.overall.totalRevenue === 'number' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium">${data.financials.overall.totalRevenue.toLocaleString()}</span>
                </div>
              )}
              {data.financials.overall?.sourceLocation && (
                <div className="text-xs text-gray-500 mt-2">
                  Source: Page {data.financials.overall.sourceLocation.page}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {segments && (
        <Card 
          icon={<FileText className="h-5 w-5 text-purple-500" />} 
          title="Raw Segments"
        >
          <div className="space-y-4">
            {segments.map((segment, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Segment {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    Pages {segment.pageRange.start}-{segment.pageRange.end}
                  </span>
                </div>
                <pre className="text-sm whitespace-pre-wrap text-gray-600 max-h-40 overflow-y-auto">
                  {segment.text}
                </pre>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Raw JSON Data */}
      <div className="mt-8">
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
            View Raw JSON Data
          </summary>
          <div className="mt-2 bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};