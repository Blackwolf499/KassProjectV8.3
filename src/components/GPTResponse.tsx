import React from 'react';
import { ChatBubbleLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface GPTResponseProps {
  response: string;
  error: string | null;
  loading: boolean;
}

export function GPTResponse({ response, error, loading }: GPTResponseProps) {
  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-500">Analyzing document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow">
      <div className="flex items-start space-x-4">
        <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h3>
          <div className="prose max-w-none text-gray-700">
            {response.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}