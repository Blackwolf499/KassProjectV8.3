import { RetryableError, MaxRetriesExceededError } from '../errors/RetryableError';
import { errorLogger } from '../errors/logger';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  shouldRetry: () => true,
  onRetry: () => {}
};

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!opts.shouldRetry(lastError) || attempt === opts.maxRetries) {
        const finalError = new MaxRetriesExceededError(
          `Operation failed after ${opts.maxRetries} attempts: ${lastError.message}`,
          opts.maxRetries,
          lastError
        );

        errorLogger.log(finalError, 'error', {
          code: 'MAX_RETRIES_EXCEEDED',
          context: {
            attempts: attempt,
            maxRetries: opts.maxRetries,
            originalError: lastError
          }
        });

        throw finalError;
      }

      const delay = Math.min(
        opts.baseDelay * Math.pow(2, attempt - 1),
        opts.maxDelay
      );

      opts.onRetry(lastError, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}