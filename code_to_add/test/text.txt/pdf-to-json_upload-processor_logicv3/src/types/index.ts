// Update PDFFileInfo type to include new fields
export interface PDFFileInfo {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  uploadedAt: Date;
  processedAt?: Date;
  extractedData?: ExtractedData;
}

// Rest of the types file remains the same