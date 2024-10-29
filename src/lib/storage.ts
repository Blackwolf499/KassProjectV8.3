import { TempFileStore } from './storage/TempFileStore';

export const tempFileStore = TempFileStore.getInstance();
export type { StoredFile } from './storage/types';
export * from './storage/TempFileStore';