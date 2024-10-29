export * from './APIError';
export * from './ProcessingError';
export * from './RetryableError';

export function handleError(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid request format. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your API key.';
      case 403:
        return 'Access denied. Please check your permissions.';
      case 404:
        return 'Resource not found. Please try again.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error. We\'re working on it.';
      default:
        return `API Error: ${error.message}`;
    }
  }

  if (error instanceof ProcessingError) {
    switch (error.code) {
      case 'PDF_EXTRACTION_FAILED':
        return 'Failed to extract text from PDF. Please ensure the file is not corrupted.';
      case 'INVALID_FORMAT':
        return 'Invalid file format. Please provide a valid PDF file.';
      case 'PROCESSING_TIMEOUT':
        return 'Processing timed out. Please try again with a smaller file.';
      default:
        return `Processing Error: ${error.message}`;
    }
  }

  if (error instanceof RetryableError) {
    return `Operation failed after ${error.maxRetries} attempts. Please try again later.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}