import React, { useState, useCallback } from 'react';
import { DocumentTextIcon, XCircleIcon, Cog6ToothIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { FileProcessingService } from '../lib/services';
import { uploadFileToServer } from '../api/files/client';
import type { ProcessingResult, ProcessingProgress } from '../lib/services';

interface BatchProcessingQueueProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onProcessingComplete?: (results: ProcessingResult[]) => void;
}

export function BatchProcessingQueue({ 
  files, 
  onRemoveFile,
  onProcessingComplete 
}: BatchProcessingQueueProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverFiles, setServerFiles] = useState<Set<number>>(new Set());

  const handleProgress = useCallback((fileIndex: number, progress: ProcessingProgress) => {
    setCurrentFileIndex(fileIndex);
    setProgress(progress);
  }, []);

  const handleUploadToServer = async () => {
    if (selectedFiles.size === 0) return;
    
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (index) => {
        const file = files[index];
        await uploadFileToServer(file);
        return index;
      });

      const uploadedIndices = await Promise.all(uploadPromises);
      setServerFiles(new Set([...serverFiles, ...uploadedIndices]));
    } catch (error) {
      console.error('Server upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload to server');
    } finally {
      setUploading(false);
    }
  };

  const handleProcessSelected = async () => {
    if (selectedFiles.size === 0) return;
    
    setProcessing(true);
    setError(null);
    const filesToProcess = files.filter((_, index) => selectedFiles.has(index));

    try {
      const processingService = FileProcessingService.getInstance();
      const results = await processingService.batchProcess(filesToProcess, handleProgress);
      
      const errors = results.filter(result => !result.success);
      if (errors.length > 0) {
        setError(`Failed to process ${errors.length} file(s). Please check the console for details.`);
      }

      onProcessingComplete?.(results);
    } catch (error) {
      console.error('Batch processing error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setProcessing(false);
      setCurrentFileIndex(-1);
      setProgress(null);
    }
  };

  const getProgressText = (progress: ProcessingProgress) => {
    if (progress.phase === 'extraction') {
      return `Extracting text (${progress.currentPage}/${progress.totalPages})`;
    }
    return 'Processing with AI';
  };

  return (
    <div className="space-y-4 mt-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Processing Queue</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleUploadToServer}
              disabled={selectedFiles.size === 0 || uploading}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                selectedFiles.size > 0 && !uploading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CloudArrowUpIcon className={`h-5 w-5 mr-2 ${uploading ? 'animate-spin' : ''}`} />
              {uploading ? 'Uploading...' : 'Add to Server'}
            </button>
            <button
              onClick={handleProcessSelected}
              disabled={selectedFiles.size === 0 || processing}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                selectedFiles.size > 0 && !processing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Cog6ToothIcon className={`h-5 w-5 mr-2 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Processing...' : 'Process Selected'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center justify-between p-3 rounded-md ${
                  currentFileIndex === index
                    ? 'bg-blue-50 border border-blue-200'
                    : serverFiles.has(index)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(index)}
                    onChange={() => {
                      const newSelection = new Set(selectedFiles);
                      if (selectedFiles.has(index)) {
                        newSelection.delete(index);
                      } else {
                        newSelection.add(index);
                      }
                      setSelectedFiles(newSelection);
                    }}
                    disabled={processing || uploading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  {serverFiles.has(index) && (
                    <span className="text-xs text-green-600">Saved to server</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  {currentFileIndex === index && progress && (
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-blue-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-blue-600">
                        {getProgressText(progress)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => onRemoveFile(index)}
                    disabled={processing || uploading}
                    className={`text-gray-400 hover:text-gray-500 ${
                      (processing || uploading) ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}