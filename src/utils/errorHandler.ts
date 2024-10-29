export class ProcessingError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export function handleProcessingError(error: unknown): string {
  if (error instanceof ProcessingError) {
    return error.message;
  }

  if (error instanceof Error) {
    if (error.message.includes('parse')) {
      return 'Failed to parse the document. Please ensure it contains valid data.';
    }
    if (error.message.includes('network')) {
      return 'Network error occurred. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'The request timed out. Please try again.';
    }
    if (error.message.includes('aborted')) {
      return 'Processing was cancelled by the user.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function validatePDFContent(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new ProcessingError('The PDF appears to be empty or contains no readable text.');
  }

  if (text.length < 50) {
    throw new ProcessingError('The PDF contains too little text to process effectively.');
  }

  if (text.includes('�') || text.includes('□')) {
    throw new ProcessingError('The PDF contains invalid characters. Please check the file encoding.');
  }
}

export function validateOpenAIResponse(response: any): void {
  if (!response || typeof response !== 'object') {
    throw new ProcessingError('Invalid response format from AI processing.');
  }

  if (!response.members || !Array.isArray(response.members)) {
    throw new ProcessingError('Missing or invalid member data in the response.');
  }

  if (!response.financials || typeof response.financials !== 'object') {
    throw new ProcessingError('Missing or invalid financial data in the response.');
  }

  if (!response.metadata || typeof response.metadata !== 'object') {
    throw new ProcessingError('Missing or invalid metadata in the response.');
  }
}