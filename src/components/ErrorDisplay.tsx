import React from 'react';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
  details?: string;
}

export function ErrorDisplay({ message, onDismiss, details }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-red-100">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-red-800">{message}</p>
            {details && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-1 text-sm text-red-600 hover:text-red-500"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            )}
            {showDetails && details && (
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-x-auto">
                {details}
              </pre>
            )}
          </div>
          {onDismiss && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                onClick={onDismiss}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}