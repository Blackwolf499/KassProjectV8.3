import React from 'react';
import { Clock, FileText } from 'lucide-react';
import type { PDFFileInfo } from '../types';

interface PDFSidebarProps {
  files: PDFFileInfo[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2);
};

const formatTimestamp = (date: Date): string => {
  return new Date(date).toLocaleTimeString();
};

const formatProcessingTime = (ms: number): string => {
  if (!ms) return '---';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

const getHighestEarner = (file: PDFFileInfo) => {
  if (!file.extractedData?.financials?.byMember?.length) return null;

  return file.extractedData.financials.byMember.reduce((highest, current) => {
    if (!highest || (current.summary?.totalRevenue || 0) > (highest.summary?.totalRevenue || 0)) {
      return current;
    }
    return highest;
  }, null);
};

export const PDFSidebar: React.FC<PDFSidebarProps> = ({
  files,
  selectedFileId,
  onSelectFile,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 h-screen overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Session History</h2>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No files processed yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const highestEarner = getHighestEarner(file);
            const totalRevenue = file.extractedData?.financials?.overall?.totalRevenue;
            const totalPeople = file.extractedData?.members?.length || 0;

            return (
              <button
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedFileId === file.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.pageCount} pages, {formatFileSize(file.size)}MB
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {formatTimestamp(file.uploadedAt)}
                      {file.processedAt && ` • Processed: ${formatTimestamp(file.processedAt)}`}
                    </p>
                    {file.extractedData && (
                      <div className="mt-2 text-xs">
                        <p className="text-blue-600">
                          Total Revenue: ${totalRevenue?.toLocaleString() || '0'}
                        </p>
                        <p className="text-gray-600">
                          Total People: {totalPeople}
                        </p>
                        {highestEarner && (
                          <p className="text-green-600">
                            Top Earner: {highestEarner.memberId} (${highestEarner.summary?.totalRevenue?.toLocaleString() || '0'})
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};