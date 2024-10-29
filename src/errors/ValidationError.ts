export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value?: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}