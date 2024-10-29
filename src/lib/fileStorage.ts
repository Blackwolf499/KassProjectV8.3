export interface StoredFile {
  id: string;
  originalName: string;
  type: 'original' | 'split';
  path: string;
  pageNumber?: number;
  totalPages?: number;
  createdAt: Date;
}

export interface ProcessedDocument {
  fileId: string;
  type: 'full' | 'page';
  pageNumber?: number;
  analysis: any;
  createdAt: Date;
}

class FileStorage {
  private files: Map<string, StoredFile> = new Map();
  private analyses: Map<string, ProcessedDocument> = new Map();

  async storeFile(file: File | Blob, options: {
    type: 'original' | 'split';
    pageNumber?: number;
    totalPages?: number;
  }): Promise<StoredFile> {
    const id = crypto.randomUUID();
    const storedFile: StoredFile = {
      id,
      originalName: file instanceof File ? file.name : `page-${options.pageNumber}.pdf`,
      type: options.type,
      path: URL.createObjectURL(file),
      pageNumber: options.pageNumber,
      totalPages: options.totalPages,
      createdAt: new Date()
    };

    this.files.set(id, storedFile);
    return storedFile;
  }

  async storeAnalysis(analysis: any, options: {
    fileId: string;
    type: 'full' | 'page';
    pageNumber?: number;
  }): Promise<ProcessedDocument> {
    const processed: ProcessedDocument = {
      fileId: options.fileId,
      type: options.type,
      pageNumber: options.pageNumber,
      analysis,
      createdAt: new Date()
    };

    this.analyses.set(options.fileId + (options.pageNumber ? `-${options.pageNumber}` : ''), processed);
    return processed;
  }

  getFile(id: string): StoredFile | undefined {
    return this.files.get(id);
  }

  getAnalysis(fileId: string, pageNumber?: number): ProcessedDocument | undefined {
    return this.analyses.get(fileId + (pageNumber ? `-${pageNumber}` : ''));
  }

  getFilesByOriginal(originalId: string): StoredFile[] {
    return Array.from(this.files.values())
      .filter(file => file.id === originalId || 
        (file.type === 'split' && file.originalName === this.files.get(originalId)?.originalName));
  }
}

export const fileStorage = new FileStorage();