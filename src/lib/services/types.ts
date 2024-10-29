/**
 * Types for file processing service
 */

/**
 * Progress information during file processing
 */
export interface ProcessingProgress {
  /** Current processing phase */
  phase: 'extraction' | 'processing';
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Current page being processed */
  currentPage: number;
  
  /** Total pages in document */
  totalPages: number;
}

/**
 * Result of file processing operation
 */
export interface ProcessingResult {
  /** Unique identifier for the processed file */
  fileId: string;
  
  /** Original filename */
  fileName: string;
  
  /** Whether processing completed successfully */
  success: boolean;
  
  /** Processed data (if successful) */
  data?: any;
  
  /** Error message (if failed) */
  error?: string;
}