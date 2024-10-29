import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import type { ProcessingStatus as StatusType } from '../types';

interface StatusProps {
  status: StatusType;
  onCancel?: () => void;
  elapsedTime: number;
}

export const ProcessingStatus: React.FC<StatusProps> = ({ status, onCancel, elapsedTime }) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  if (!status.isLoading && !status.error) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-4">
      {status.isLoading && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" />
            <span>Processing PDF - {formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600 font-medium">{status.progress}%</span>
              <div className="w-24 h-2 bg-blue-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
      )}
      {status.error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span>Failed to process PDF</span>
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
            >
              <span className="text-sm">Error Details</span>
              {showErrorDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          {showErrorDetails && (
            <div className="mt-2 p-3 bg-red-100 rounded border border-red-200 text-sm font-mono whitespace-pre-wrap">
              {status.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};