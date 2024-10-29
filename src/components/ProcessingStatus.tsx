import React from 'react';
import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { ProcessingStatus as StatusType } from '../types';

interface ProcessingStatusProps {
  status: StatusType;
  onCancel?: () => void;
  elapsedTime: number;
}

export function ProcessingStatus({ status, onCancel, elapsedTime }: ProcessingStatusProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (!status.isLoading && !status.error) return null;

  return (
    <div className="mt-4">
      {status.isLoading && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
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
                <XCircleIcon className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      )}
      {status.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircleIcon className="h-5 w-5" />
            <span>{status.error}</span>
          </div>
        </div>
      )}
    </div>
  );
}