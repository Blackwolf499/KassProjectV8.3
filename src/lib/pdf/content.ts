import { PDFContent, PDFPage } from '../types/pdf';
import { extractTables } from './tables';

export async function extractContent(pdf: any): Promise<PDFContent> {
  const pages: PDFPage[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const processedContent = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .trim();
    
    const tables = await extractTables(page);
    
    pages.push({
      pageNumber: i,
      content: processedContent,
      tables
    });
  }
  
  return { pages };
}