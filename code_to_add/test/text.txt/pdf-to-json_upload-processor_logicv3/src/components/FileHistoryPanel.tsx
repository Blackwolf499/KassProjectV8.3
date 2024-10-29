import React from 'react';
import { Clock, FileText } from 'lucide-react';
import type { FileHistory } from '../types';

interface FileHistoryPanelProps {
  history: FileHistory[];
  selectedFileId: string | null;
  onSelectFile: (file: FileHistory) => void;
}

export const FileHistoryPanel: React.FC<FileHistoryPanelProps> = ({
  history,
  selectedFileId,
  onSelectFile,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">File History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No files processed yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelectFile(file)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedFileId === file.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(file.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};