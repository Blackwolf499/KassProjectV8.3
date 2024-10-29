import { errorLogger } from './logger';
import { APIError } from './APIError';
import { ProcessingError } from './ProcessingError';
import { ValidationError } from './ValidationError';
import { RetryableError } from './RetryableError';
import type { ErrorDetails } from './types';

export function handleProcessingError(error: unknown): string {
  let message: string;
  let details: Partial<ErrorDetails> = {
    timestamp: new Date().toISOString()
  };

  if (error instanceof ProcessingError) {
    message = getProcessingErrorMessage(error);
    details = {
      ...details,
      code: error.code,
      context: error.details
    };
  } else if (error instanceof APIError) {
    message = getAPIErrorMessage(error);
    details = {
      ...details,
      code: `API_${error.statusCode}`,
      context: error.details
    };
  } else if (error instanceof ValidationError) {
    message = `Validation failed: ${error.message} (${error.field})`;
    details = {
      ...details,
      code: 'VALIDATION_ERROR',
      context: { field: error.field, value: error.value }
    };
  } else if (error instanceof RetryableError) {
    message = `Operation failed after ${error.maxRetries} attempts`;
    details = {
      ...details,
      code: 'RETRY_EXHAUSTED',
      context: { maxRetries: error.maxRetries, delay: error.retryDelay }
    };
  } else if (error instanceof Error) {
    message = error.message;
    details = {
      ...details,
      code: 'UNKNOWN_ERROR',
      originalError: error
    };
  } else {
    message = 'An unexpected error occurred';
    details = {
      ...details,
      code: 'UNKNOWN_ERROR',
      context: { error }
    };
  }

  errorLogger.log(
    error instanceof Error ? error : new Error(message),
    'error',
    details
  );

  return message;
}

function getProcessingErrorMessage(error: ProcessingError): string {
  switch (error.code) {
    case 'PDF_EXTRACTION_FAILED':
      return 'Failed to extract text from PDF. Please ensure the file is not corrupted.';
    case 'INVALID_FORMAT':
      return 'Invalid file format. Please provide a valid PDF file.';
    case 'EMPTY_CONTENT':
      return 'No text content found in the PDF. Please ensure the file contains readable text.';
    case 'AI_PROCESSING_FAILED':
      return 'Failed to process the document content. Please try again.';
    default:
      return error.message;
  }
}

function getAPIErrorMessage(error: APIError): string {
  switch (error.statusCode) {
    case 400:
      return 'Invalid request format. Please check your input.';
    case 401:
      return 'Authentication failed. Please check your API key.';
    case 403:
      return 'Access denied. Please check your permissions.';
    case 429:
      return 'Rate limit exceeded. Please wait a moment and try again.';
    case 500:
      return 'Server error occurred. Please try again later.';
    default:
      return `API Error: ${error.message}`;
  }
}