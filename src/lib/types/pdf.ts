export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface PDFPage {
  pageNumber: number;
  content: string;
  tables?: any[];
  images?: string[];
}

export interface PDFContent {
  pages: PDFPage[];
}

export interface ProcessedPDFDocument {
  metadata: PDFMetadata;
  content: PDFContent;
  structuredData: any;
  analysis: string;
}