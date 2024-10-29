export interface UploadedFile {
  fileName: string;
  originalName: string;
  size: number;
  path: string;
}

export interface FileDetails {
  name: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

export interface FileError {
  error: string;
  details?: string;
}