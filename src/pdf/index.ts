import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { ProcessingError } from '../../errors';

// Set worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  if (!file) {
    throw new ProcessingError('No file provided', 'INVALID_INPUT');
  }

  if (file.type !== 'application/pdf') {
    throw new ProcessingError('Invalid file type. Please provide a PDF file.', 'INVALID_FORMAT');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    if (!pdf || pdf.numPages === 0) {
      throw new ProcessingError('Invalid or empty PDF file', 'INVALID_CONTENT');
    }

    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      if (!textContent || !textContent.items) {
        console.warn(`No text content found on page ${i}`);
        continue;
      }

      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }

    if (!fullText.trim()) {
      throw new ProcessingError('No text content could be extracted from the PDF', 'EMPTY_CONTENT');
    }

    return fullText.trim();
  } catch (error) {
    if (error instanceof ProcessingError) {
      throw error;
    }

    console.error('PDF extraction error:', error);
    throw new ProcessingError(
      'Failed to extract text from PDF',
      'PDF_EXTRACTION_FAILED',
      { originalError: error }
    );
  }
}