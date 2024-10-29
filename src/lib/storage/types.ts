export interface StoredFile {
  id: string;
  originalName: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

export interface StorageOptions {
  retentionPeriod?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
}