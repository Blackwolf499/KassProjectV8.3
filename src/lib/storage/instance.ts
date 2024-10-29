import { TempFileStore } from './TempFileStore';

export const tempFileStore = TempFileStore.getInstance({
  retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['application/pdf']
});