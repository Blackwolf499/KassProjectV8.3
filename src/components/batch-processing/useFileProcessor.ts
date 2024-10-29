import { useState } from 'react';
import { ProcessingError, APIError, ValidationError, handleError } from '../../errors';
import { processDocumentWithAI } from '../../api/openai';
import { extractTextFromPDF } from '../../api/pdf';
import { useUpload } from '../../context/UploadContext';
import { TempFileStore } from '../../lib/storage';

interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useFileProcessor() {
  const { dispatch } = useUpload();
  const [error, setError] = useState<string | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const fileStore = TempFileStore.getInstance();

  const uploadToStorage = async (file: File, stepId: string) => {
    try {
      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            message: `Uploading ${file.name} to storage`,
            progress: 0,
            status: 'processing'
          }
        }
      });

      const storedFile = await fileStore.storeFile(file);

      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            message: `Successfully stored ${file.name}`,
            progress: 100,
            status: 'completed'
          }
        }
      });

      return storedFile;
    } catch (error) {
      throw new ProcessingError(
        'Failed to store file',
        'STORAGE_ERROR',
        { originalError: error }
      );
    }
  };

  const processFile = async (file: File, stepId: string): Promise<ProcessingResult> => {
    try {
      // First upload to storage
      await uploadToStorage(file, `${stepId}-upload`);

      // Then proceed with text extraction
      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            message: `Extracting text from ${file.name}`,
            progress: 25,
            status: 'processing'
          }
        }
      });

      const text = await extractTextFromPDF(file);

      // Process with OpenAI
      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            message: `Processing ${file.name} with OpenAI`,
            progress: 50 
          }
        }
      });

      const result = await processDocumentWithAI(text);

      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            status: 'completed',
            message: `Successfully processed ${file.name}`,
            progress: 100 
          }
        }
      });

      return {
        success: true,
        data: result
      };

    } catch (error) {
      const errorMessage = handleError(error);
      console.error(`Error processing ${file.name}:`, error);
      
      dispatch({
        type: 'UPDATE_PROCESSING_STEP',
        payload: {
          id: stepId,
          updates: { 
            status: 'error',
            message: errorMessage,
            progress: 0 
          }
        }
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Rest of the code remains the same...

  return {
    processFile,
    processQueue,
    currentFileIndex,
    error,
    setError,
    uploadToStorage
  };
}