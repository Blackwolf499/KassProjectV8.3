import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { OpenAI } from 'openai';
import type { ExtractedData, PDFSegment } from '../types';
import { ProcessingError, validatePDFContent, validateOpenAIResponse } from './errorHandler';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SEGMENT_SIZE = 4000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && !(error instanceof ProcessingError)) {
      await delay(RETRY_DELAY);
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

export async function extractTextFromPDF(
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<PDFSegment[]> {
  try {
    if (!file) {
      throw new ProcessingError('No file provided');
    }

    if (file.type !== 'application/pdf') {
      throw new ProcessingError('Invalid file type. Please provide a PDF file.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    if (numPages === 0) {
      throw new ProcessingError('Invalid PDF file: No pages found');
    }

    const segments: PDFSegment[] = [];
    let currentSegment = '';
    let currentPage = 1;
    let segmentStart = 0;

    for (let i = 1; i <= numPages; i++) {
      if (signal?.aborted) {
        throw new ProcessingError('Processing aborted by user');
      }

      const page = await retryOperation(async () => {
        const pageObj = await pdf.getPage(i);
        const textContent = await pageObj.getTextContent();
        return textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
      });

      if (!page) {
        console.warn(`No text content found on page ${i}`);
        continue;
      }

      currentSegment += page + ' ';
      
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
      await delay(100);
    }

    validatePDFContent(segments.map(s => s.text).join(' '));

    return segments;
  } catch (error) {
    if (error instanceof ProcessingError) {
      throw error;
    }
    console.error('PDF extraction error:', error);
    throw new ProcessingError(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function processWithAI(
  segments: PDFSegment[],
  onProgress: (progress: number, partialData?: Partial<ExtractedData>) => void,
  signal?: AbortSignal
): Promise<ExtractedData> {
  if (!segments || segments.length === 0) {
    throw new ProcessingError('No text segments provided for processing');
  }

  try {
    const results = await Promise.all(
      segments.map(async (segment, index) => {
        if (signal?.aborted) {
          throw new ProcessingError('Processing aborted by user');
        }

        return await retryOperation(async () => {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Process this document segment (${index + 1}/${segments.length}) and extract all relevant data. Ensure all numerical values and relationships are preserved.`
              },
              {
                role: "user",
                content: segment.text
              }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
          });

          if (!completion.choices[0]?.message?.content) {
            throw new ProcessingError(`Empty response for segment ${index + 1}`);
          }

          try {
            const result = JSON.parse(completion.choices[0].message.content);
            validateOpenAIResponse(result);
            onProgress(((index + 1) / segments.length) * 50, result);
            return { ...result, segment };
          } catch (parseError) {
            throw new ProcessingError(`Invalid JSON response for segment ${index + 1}`);
          }
        });
      })
    );

    return mergeResults(results);
  } catch (error) {
    if (error instanceof ProcessingError) {
      throw error;
    }
    throw new ProcessingError(
      `AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function mergeResults(results: any[]): ExtractedData {
  if (!results || results.length === 0) {
    throw new ProcessingError('No valid results to merge');
  }

  const merged: ExtractedData = {
    members: [],
    financials: {
      byMember: [],
      overall: {
        totalSales: 0,
        totalRevenue: 0,
        sourceLocation: { page: 1, index: 0 }
      }
    },
    metadata: {
      extractionTimestamp: new Date().toISOString(),
      sourceLocation: { page: 1, index: 0 }
    }
  };

  try {
    results.forEach((result, index) => {
      if (!result || typeof result !== 'object') {
        throw new ProcessingError(`Invalid result format at index ${index}`);
      }

      // Merge members
      if (Array.isArray(result.members)) {
        merged.members.push(...result.members);
      }

      // Merge financials
      if (result.financials) {
        if (Array.isArray(result.financials.byMember)) {
          merged.financials.byMember.push(...result.financials.byMember);
        }
        if (result.financials.overall) {
          merged.financials.overall.totalSales += result.financials.overall.totalSales || 0;
          merged.financials.overall.totalRevenue += result.financials.overall.totalRevenue || 0;
        }
      }
    });

    return merged;
  } catch (error) {
    throw new ProcessingError(
      `Failed to merge results: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}