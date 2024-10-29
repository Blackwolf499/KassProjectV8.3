import { PDFMetadata } from '../types/pdf';

export async function extractMetadata(pdf: any): Promise<PDFMetadata> {
  try {
    const info = await pdf.getMetadata();
    return {
      title: info?.info?.Title,
      author: info?.info?.Author,
      subject: info?.info?.Subject,
      keywords: info?.info?.Keywords,
      creator: info?.info?.Creator,
      producer: info?.info?.Producer,
      creationDate: info?.info?.CreationDate ? new Date(info.info.CreationDate) : undefined,
      modificationDate: info?.info?.ModDate ? new Date(info.info.ModDate) : undefined,
    };
  } catch (error) {
    console.warn('Error extracting metadata:', error);
    return {};
  }
}