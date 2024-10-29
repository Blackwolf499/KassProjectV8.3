import * as pdfjsLib from 'pdfjs-dist';
import type { PDFSegment } from '../types';
import { retryOperation } from './utils';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

const SEGMENT_SIZE = 4000; // Characters per segment
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function extractTextFromPDF(
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<PDFSegment[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const segments: PDFSegment[] = [];
    let currentSegment = '';
    let currentPage = 1;
    let segmentStart = 0;

    for (let i = 1; i <= numPages; i++) {
      if (signal?.aborted) {
        throw new Error('Processing aborted');
      }

      const pageText = await retryOperation(async () => {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        return textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
      }, MAX_RETRIES, RETRY_DELAY);

      if (!pageText) {
        console.warn(`No text content found on page ${i}`);
        continue;
      }

      currentSegment += pageText + ' ';
      
      if (currentSegment.length >= SEGMENT_SIZE || i === numPages) {
        const cleanedSegment = currentSegment
          .replace(/\s+/g, ' ')
          .trim();

        if (cleanedSegment.length > 0) {
          segments.push({
            text: cleanedSegment,
            pageRange: {
              start: currentPage,
              end: i
            },
            segmentIndex: segments.length,
            startPosition: segmentStart
          });
        }

        currentSegment = '';
        currentPage = i + 1;
        segmentStart += SEGMENT_SIZE;
      }

      onProgress(Math.round((i / numPages) * 50));
      
      // Add small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return segments;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}