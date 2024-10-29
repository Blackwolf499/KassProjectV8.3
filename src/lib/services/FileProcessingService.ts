/**
 * FileProcessingService - Singleton service for processing PDF files with OpenAI integration
 * 
 * Features:
 * - PDF text extraction with progress tracking
 * - OpenAI GPT-4 processing with structured output
 * - Batch processing capabilities
 * - Abort control for long-running operations
 * 
 * @example
 * ```typescript
 * const service = FileProcessingService.getInstance();
 * const results = await service.batchProcess(files, (fileIndex, progress) => {
 *   console.log(`Processing file ${fileIndex}: ${progress.progress}%`);
 * });
 * ```
 */
import { OpenAI } from 'openai';
import { extractTextFromPDF } from '../pdf';
import type { ProcessingResult, ProcessingProgress } from './types';

export class FileProcessingService {
  private static instance: FileProcessingService;
  private readonly openai: OpenAI;
  private readonly processingQueue: Map<string, AbortController>;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    this.processingQueue = new Map();
  }

  /**
   * Get singleton instance of FileProcessingService
   * @returns {FileProcessingService} The singleton instance
   */
  public static getInstance(): FileProcessingService {
    if (!FileProcessingService.instance) {
      FileProcessingService.instance = new FileProcessingService();
    }
    return FileProcessingService.instance;
  }

  /**
   * Process multiple files in sequence with progress tracking
   * 
   * @param files - Array of files to process
   * @param onProgress - Optional callback for progress updates
   * @returns Promise resolving to array of processing results
   * 
   * @throws {Error} If file processing fails
   */
  public async batchProcess(
    files: File[],
    onProgress?: (fileIndex: number, progress: ProcessingProgress) => void
  ): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const currentFile = files[fileIndex];
      const processId = crypto.randomUUID();
      const abortController = new AbortController();
      
      this.processingQueue.set(processId, abortController);

      try {
        // Process individual file with progress tracking
        const result = await this.processFile(
          currentFile, 
          (progress) => onProgress?.(fileIndex, progress),
          abortController.signal
        );

        results.push({
          fileId: processId,
          fileName: currentFile.name,
          success: true,
          data: result
        });
      } catch (error) {
        console.error(`Error processing ${currentFile.name}:`, error);
        results.push({
          fileId: processId,
          fileName: currentFile.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        this.processingQueue.delete(processId);
      }
    }

    return results;
  }

  /**
   * Process a single file through text extraction and AI analysis
   * 
   * @param file - File to process
   * @param onProgress - Optional progress callback
   * @param signal - Optional AbortSignal for cancellation
   * @returns Promise resolving to processed data
   * 
   * @throws {Error} If processing fails or is aborted
   */
  private async processFile(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void,
    signal?: AbortSignal
  ): Promise<any> {
    // Phase 1: Extract text from PDF
    const extractedText = await extractTextFromPDF(
      file,
      (progress) => {
        onProgress?.({
          phase: 'extraction',
          progress: progress * 0.5, // First 50% of total progress
          currentPage: progress,
          totalPages: 100
        });
      },
      signal
    );

    if (signal?.aborted) {
      throw new Error('Processing aborted by user');
    }

    // Phase 2: Process with GPT-4
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Process this document and extract structured data. Data integrity is paramount.
          Format the extracted data into a comprehensive JSON structure that accurately represents the original content.
          It is essential to maintain complete accuracy and include every detail.`
        },
        { role: "user", content: extractedText }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    if (signal?.aborted) {
      throw new Error('Processing aborted by user');
    }

    // Update progress to completion
    onProgress?.({
      phase: 'processing',
      progress: 100,
      currentPage: 100,
      totalPages: 100
    });

    // Parse and return the AI response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from AI processing');
    }

    return JSON.parse(responseContent);
  }

  /**
   * Abort processing for a specific file
   * 
   * @param processId - ID of the process to abort
   */
  public abortProcessing(processId: string): void {
    const controller = this.processingQueue.get(processId);
    if (controller) {
      controller.abort();
      this.processingQueue.delete(processId);
    }
  }
}