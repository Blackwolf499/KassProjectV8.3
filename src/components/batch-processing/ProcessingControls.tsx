import React from 'react';
import { CloudIcon, CpuChipIcon, Cog6ToothIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ProcessingControlsProps {
  processingMode: 'full' | 'pages';
  processingEngine: 'local' | 'openai';
  processing: boolean;
  selectedCount: number;
  onModeChange: (mode: 'full' | 'pages') => void;
  onEngineChange: (engine: 'local' | 'openai') => void;
  onProcess: () => void;
  onUploadToServer: () => void;
}

export function ProcessingControls({
  processingMode,
  processingEngine,
  processing,
  selectedCount,
  onModeChange,
  onEngineChange,
  onProcess,
  onUploadToServer
}: ProcessingControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <select
          value={processingMode}
          onChange={(e) => onModeChange(e.target.value as 'full' | 'pages')}
          className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          disabled={processing}
        >
          <option value="full">Process Full Documents</option>
          <option value="pages">Process Individual Pages</option>
        </select>

        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => onEngineChange('local')}
            className={`px-4 py-2 inline-flex items-center ${
              processingEngine === 'local'
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } border text-sm font-medium rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={processing}
          >
            <CpuChipIcon className="h-4 w-4 mr-2" />
            Local
          </button>
          <button
            onClick={() => onEngineChange('openai')}
            className={`px-4 py-2 inline-flex items-center ${
              processingEngine === 'openai'
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } border-t border-r border-b text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={processing}
          >
            <CloudIcon className="h-4 w-4 mr-2" />
            OpenAI
          </button>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onUploadToServer}
          disabled={selectedCount === 0 || processing}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            selectedCount > 0 && !processing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Upload to Server
        </button>

        <button
          onClick={onProcess}
          disabled={selectedCount === 0 || processing}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            selectedCount > 0 && !processing
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Cog6ToothIcon className={`h-5 w-5 mr-2 ${processing ? 'animate-spin' : ''}`} />
          {processing ? 'Processing...' : 'Process Selected'}
        </button>
      </div>
    </div>
  );
}