import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Invalid file type. Please provide a PDF file.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    if (!pdf || pdf.numPages === 0) {
      throw new Error('Invalid or empty PDF file');
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
      throw new Error('No text content could be extracted from the PDF');
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to extract text from PDF: ${error.message}`
        : 'Failed to extract text from PDF'
    );
  }
}