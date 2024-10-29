import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface FileListProps {
  files: File[];
  selectedFiles: Set<number>;
  processing: boolean;
  currentProcessingIndex: number;
  progress: { current: number; total: number };
  onToggleFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
}

export function FileList({
  files,
  selectedFiles,
  processing,
  currentProcessingIndex,
  progress,
  onToggleFile,
  onRemoveFile
}: FileListProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center justify-between p-3 rounded-md ${
              currentProcessingIndex === index
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedFiles.has(index)}
                onChange={() => onToggleFile(index)}
                disabled={processing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              {currentProcessingIndex === index ? (
                <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-900">{file.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              {currentProcessingIndex === index && (
                <span className="text-sm text-blue-600">
                  Processing ({progress.current + 1}/{progress.total})
                </span>
              )}
              <button
                onClick={() => onRemoveFile(index)}
                disabled={processing}
                className={`text-gray-400 hover:text-gray-500 ${
                  processing ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}