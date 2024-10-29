export interface ErrorDetails {
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  originalError?: Error;
}

export interface ValidationErrorDetails extends ErrorDetails {
  field: string;
  value?: any;
  constraints?: Record<string, string>;
}

export interface APIErrorDetails extends ErrorDetails {
  statusCode: number;
  endpoint?: string;
  requestId?: string;
}

export interface ProcessingErrorDetails extends ErrorDetails {
  phase: 'extraction' | 'processing' | 'analysis';
  fileInfo?: {
    name: string;
    size: number;
    type: string;
  };
}

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorLogEntry {
  id: string;
  severity: ErrorSeverity;
  details: ErrorDetails;
  stack?: string;
  handled: boolean;
}