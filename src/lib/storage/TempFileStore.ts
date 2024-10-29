import type { StoredFile, StorageOptions } from './types';

const DEFAULT_OPTIONS: Required<StorageOptions> = {
  retentionPeriod: 86400 * 1000, // 24 hours
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['application/pdf']
};

export class TempFileStore {
  private static instance: TempFileStore;
  private files: Map<string, StoredFile> = new Map();
  private options: Required<StorageOptions>;

  private constructor(options: StorageOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.startCleanupInterval();
  }

  public static getInstance(options?: StorageOptions): TempFileStore {
    if (!TempFileStore.instance) {
      TempFileStore.instance = new TempFileStore(options);
    }
    return TempFileStore.instance;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpiredFiles();
    }, 3600000); // Check every hour
  }

  private cleanupExpiredFiles(): void {
    const now = new Date();
    for (const [id, file] of this.files.entries()) {
      if (file.expiresAt <= now) {
        URL.revokeObjectURL(file.path);
        this.files.delete(id);
      }
    }
  }

  private validateFile(file: File): void {
    if (file.size > this.options.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.options.maxFileSize} bytes`);
    }

    if (!this.options.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
  }

  public async storeFile(file: File, metadata?: Record<string, unknown>): Promise<StoredFile> {
    this.validateFile(file);

    const id = crypto.randomUUID();
    const storedFile: StoredFile = {
      id,
      originalName: file.name,
      path: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      expiresAt: new Date(Date.now() + this.options.retentionPeriod),
      metadata
    };

    this.files.set(id, storedFile);
    return storedFile;
  }

  public getFile(id: string): StoredFile | undefined {
    return this.files.get(id);
  }

  public deleteFile(id: string): void {
    const file = this.files.get(id);
    if (file) {
      URL.revokeObjectURL(file.path);
      this.files.delete(id);
    }
  }

  public getStoredFiles(): StoredFile[] {
    return Array.from(this.files.values());
  }

  public updateFileMetadata(id: string, metadata: Record<string, unknown>): void {
    const file = this.files.get(id);
    if (file) {
      this.files.set(id, { ...file, metadata: { ...file.metadata, ...metadata } });
    }
  }

  public clearExpiredFiles(): void {
    this.cleanupExpiredFiles();
  }

  public clearAllFiles(): void {
    for (const [id, file] of this.files.entries()) {
      URL.revokeObjectURL(file.path);
      this.files.delete(id);
    }
  }
}