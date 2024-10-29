import * as pdfjsLib from 'pdfjs-dist';
import type { ExtractedData } from '../types';

// Import the worker directly
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

export async function processLocalDocument(
  file: File | Blob,
  onProgress: (progress: number) => void
): Promise<ExtractedData> {
  try {
    onProgress(10);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    onProgress(30);
    let fullText = '';
    let members = new Set();
    let transactions = [];
    let totalSales = 0;
    let totalRevenue = 0;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      // Basic pattern matching for data extraction
      const memberMatches = pageText.match(/(?:Employee|Staff|Member) ID:?\s*([A-Z0-9-]+)/gi) || [];
      const saleMatches = pageText.match(/\$\s*([0-9,.]+)/g) || [];

      memberMatches.forEach(match => {
        const id = match.split(/:\s*/)[1];
        if (id) members.add(id);
      });

      saleMatches.forEach(match => {
        const amount = parseFloat(match.replace(/[$,]/g, ''));
        if (!isNaN(amount)) {
          transactions.push({
            amount,
            type: 'sale',
            sourceLocation: { page: i, index: 0 }
          });
          totalSales++;
          totalRevenue += amount;
        }
      });
      
      onProgress(30 + (i / pdf.numPages) * 60);
    }

    const result: ExtractedData = {
      members: Array.from(members).map(id => ({
        id: String(id),
        name: `Member ${id}`,
        sourceLocation: { page: 1, index: 0 }
      })),
      financials: {
        byMember: Array.from(members).map(id => ({
          memberId: String(id),
          totalSales: totalSales / members.size,
          transactions: transactions.slice(0, Math.ceil(transactions.length / members.size)),
          summary: {
            totalRevenue: totalRevenue / members.size,
            averageTransaction: totalRevenue / totalSales,
            sourceLocation: { page: 1, index: 0 }
          }
        })),
        overall: {
          totalSales,
          totalRevenue,
          sourceLocation: { page: 1, index: 0 }
        }
      },
      metadata: {
        extractionTimestamp: new Date().toISOString(),
        sourceLocation: { page: 1, index: 0 }
      }
    };

    onProgress(100);
    return result;
  } catch (error) {
    console.error('Local processing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process document locally');
  }
}