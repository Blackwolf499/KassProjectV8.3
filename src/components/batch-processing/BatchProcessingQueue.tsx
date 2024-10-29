import React, { useState } from 'react';
import { ProcessingFeed } from '../ProcessingFeed';
import { ProcessingControls } from './ProcessingControls';
import { FileList } from './FileList';
import { useFileProcessor } from './useFileProcessor';
import { useUpload } from '../../context/UploadContext';
import { TempFileStore } from '../../lib/storage';

interface BatchProcessingQueueProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export function BatchProcessingQueue({ files, onRemoveFile }: BatchProcessingQueueProps) {
  const { dispatch } = useUpload();
  const { processQueue, error, setError, currentFileIndex, uploadToStorage } = useFileProcessor();
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [processingMode, setProcessingMode] = useState<'full' | 'pages'>('full');
  const [processingEngine, setProcessingEngine] = useState<'local' | 'openai'>('openai');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const toggleFileSelection = (index: number) => {
    const newSelection = new Set(selectedFiles);
    if (selectedFiles.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedFiles(newSelection);
  };

  const handleUploadToServer = async () => {
    if (selectedFiles.size === 0) return;
    setError(null);
    setProcessing(true);

    try {
      const filesToUpload = files.filter((_, index) => selectedFiles.has(index));
      setProgress({ current: 0, total: filesToUpload.length });

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const stepId = `upload-${i}`;

        dispatch({
          type: 'ADD_PROCESSING_STEP',
          payload: {
            id: stepId,
            message: `Uploading ${file.name} to server`,
            status: 'processing',
            progress: 0
          }
        });

        try {
          await uploadToStorage(file, stepId);
          setProgress({ current: i + 1, total: filesToUpload.length });
        } catch (error) {
          dispatch({
            type: 'UPDATE_PROCESSING_STEP',
            payload: {
              id: stepId,
              updates: { 
                status: 'error',
                message: `Failed to upload ${file.name}`,
                progress: 0 
              }
            }
          });
          console.error(`Error uploading ${file.name}:`, error);
          continue;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleProcessSelected = async () => {
    if (selectedFiles.size === 0) return;
    setError(null);
    setProcessing(true);

    try {
      const filesToProcess = files.filter((_, index) => selectedFiles.has(index));
      setProgress({ current: 0, total: filesToProcess.length });

      dispatch({ type: 'START_UPLOAD', payload: filesToProcess[0] });

      await processQueue(
        filesToProcess,
        (current, total) => setProgress({ current, total })
      );

      dispatch({ type: 'COMPLETE_PROCESSING' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {error && (
        <ProcessingFeed 
          isProcessing={processing}
          error={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upload Queue</h3>
          <ProcessingControls
            processingMode={processingMode}
            processingEngine={processingEngine}
            processing={processing}
            selectedCount={selectedFiles.size}
            onModeChange={setProcessingMode}
            onEngineChange={setProcessingEngine}
            onProcess={handleProcessSelected}
            onUploadToServer={handleUploadToServer}
          />
        </div>

        <FileList
          files={files}
          selectedFiles={selectedFiles}
          processing={processing}
          currentProcessingIndex={processing ? currentFileIndex : -1}
          progress={progress}
          onToggleFile={toggleFileSelection}
          onRemoveFile={onRemoveFile}
        />
      </div>
    </div>
  );
}