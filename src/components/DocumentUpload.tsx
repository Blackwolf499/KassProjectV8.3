import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useUpload } from '../context/UploadContext';
import { BatchProcessingQueue } from './BatchProcessingQueue';

interface DocumentUploadProps {
  onTextExtracted: (text: string, file: File) => void;
  onError: (error: string) => void;
}

export function DocumentUpload({ onTextExtracted, onError }: DocumentUploadProps) {
  const { state, dispatch } = useUpload();
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${state.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the PDFs here'
              : 'Drag and drop PDF files here, or click to select'}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <BatchProcessingQueue
          files={files}
          onRemoveFile={handleRemoveFile}
        />
      )}
    </div>
  );
}