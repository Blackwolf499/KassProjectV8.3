export class RetryableError extends Error {
  constructor(
    message: string,
    public readonly maxRetries: number,
    public readonly retryDelay: number,
    public readonly attemptNumber: number
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

export class MaxRetriesExceededError extends Error {
  constructor(
    message: string,
    public readonly maxRetries: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'MaxRetriesExceededError';
  }
}