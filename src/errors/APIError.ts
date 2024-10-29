export class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'APIError';

    // Ensure error details are properly structured
    if (this.details) {
      this.details = {
        ...this.details,
        timestamp: new Date().toISOString()
      };
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details
    };
  }
}