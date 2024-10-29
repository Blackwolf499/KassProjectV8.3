import * as pdfjsLib from 'pdfjs-dist';
import { OpenAI } from 'openai';
import type { ExtractedData, PDFSegment, MemberData, MemberFinancials } from '../types';

// Import the worker directly
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SEGMENT_SIZE = 4000; // Characters per segment

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

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      currentSegment += pageText;
      
      if (currentSegment.length >= SEGMENT_SIZE || i === numPages) {
        segments.push({
          text: currentSegment,
          pageRange: {
            start: currentPage,
            end: i
          },
          segmentIndex: segments.length,
          startPosition: segmentStart
        });
        currentSegment = '';
        currentPage = i + 1;
        segmentStart += SEGMENT_SIZE;
      }

      onProgress(Math.round((i / numPages) * 50));
    }

    return segments;
  } catch (error) {
    if (error.message === 'Processing aborted') {
      throw error;
    }
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function processWithAI(
  segments: PDFSegment[],
  onProgress: (progress: number, partialData?: Partial<ExtractedData>) => void,
  signal?: AbortSignal
): Promise<ExtractedData> {
  const systemPrompt = `Process the provided document and convert it into a structured JSON format. Data integrity is paramount; you must ensure that no information is lost during this conversion.

  Segment the input document into manageable sections for thorough analysis.
  Extract all relevant data meticulously, leaving nothing out.
  Format the extracted data into a comprehensive JSON structure that accurately represents the original content.
  It is essential to maintain complete accuracy and include every detail, as any omission could have serious implications for the financial system.

  Return a JSON object with the following structure:
  {
    "members": [{
      "id": "string (unique identifier)",
      "name": "string (full name)",
      "contact": {
        "email": "string (optional)",
        "phone": "string (optional)"
      },
      "sourceLocation": { "page": "number", "index": "number" }
    }],
    "financials": {
      "byMember": [{
        "memberId": "string",
        "totalSales": "number",
        "transactions": [{
          "amount": "number",
          "type": "string",
          "sourceLocation": { "page": "number", "index": "number" }
        }],
        "summary": {
          "totalRevenue": "number",
          "averageTransaction": "number",
          "sourceLocation": { "page": "number", "index": "number" }
        }
      }],
      "overall": {
        "totalSales": "number",
        "totalRevenue": "number",
        "sourceLocation": { "page": "number", "index": "number" }
      }
    },
    "metadata": {
      "documentDate": "string (optional)",
      "reportPeriod": "string (optional)",
      "extractionTimestamp": "string (ISO 8601 format)"
    }
  }`;

  try {
    const results = await Promise.all(
      segments.map(async (segment, index) => {
        if (signal?.aborted) {
          throw new Error('Processing aborted');
        }

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { 
                role: "user", 
                content: `Segment ${index + 1}/${segments.length} (Pages ${segment.pageRange.start}-${segment.pageRange.end}): ${segment.text}`
              }
            ],
            response_format: { type: "json_object" }
          });

          const partialData = JSON.parse(completion.choices[0].message.content || '{}');
          onProgress(Math.round(((index + 1) / segments.length) * 50), partialData);
          
          return {
            ...partialData,
            segment: segment
          };
        } catch (error) {
          console.error(`JSON Parse Error for segment ${index + 1}:`, error);
          throw new Error(`Failed to process segment ${index + 1}: ${error.message}`);
        }
      })
    );

    return mergeSegmentResults(results);
  } catch (error) {
    if (error.message === 'Processing aborted') {
      throw error;
    }
    console.error('AI processing error:', error);
    throw new Error('Failed to process document with AI');
  }
}

function mergeSegmentResults(results: any[]): ExtractedData {
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

  // Track unique members by ID
  const memberMap = new Map<string, MemberData>();
  const financialsMap = new Map<string, MemberFinancials>();

  results.forEach(result => {
    // Merge members
    result.members?.forEach((member: MemberData) => {
      if (!memberMap.has(member.id)) {
        memberMap.set(member.id, member);
      }
    });

    // Merge member financials
    result.financials?.byMember?.forEach((memberFinancials: MemberFinancials) => {
      const existing = financialsMap.get(memberFinancials.memberId);
      if (!existing) {
        financialsMap.set(memberFinancials.memberId, memberFinancials);
      } else {
        // Merge transactions and update totals
        existing.transactions.push(...memberFinancials.transactions);
        existing.totalSales += memberFinancials.totalSales;
        existing.summary.totalRevenue += memberFinancials.summary.totalRevenue;
        existing.summary.averageTransaction = 
          existing.summary.totalRevenue / existing.transactions.length;
      }
    });

    // Update overall totals
    if (result.financials?.overall) {
      merged.financials.overall.totalSales += result.financials.overall.totalSales || 0;
      merged.financials.overall.totalRevenue += result.financials.overall.totalRevenue || 0;
    }

    // Take the first metadata we find
    if (result.metadata && !merged.metadata.documentDate) {
      merged.metadata = { 
        ...result.metadata,
        extractionTimestamp: merged.metadata.extractionTimestamp
      };
    }
  });

  merged.members = Array.from(memberMap.values());
  merged.financials.byMember = Array.from(financialsMap.values());

  return merged;
}