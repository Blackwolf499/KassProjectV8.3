import { ErrorLogEntry, ErrorDetails, ErrorSeverity } from './types';

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  log(
    error: Error,
    severity: ErrorSeverity = 'error',
    details: Partial<ErrorDetails> = {}
  ): void {
    const entry: ErrorLogEntry = {
      id: crypto.randomUUID(),
      severity,
      details: {
        code: details.code || 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        context: details.context,
        originalError: details.originalError
      },
      stack: error.stack,
      handled: true
    };

    console.error('[ErrorLogger]', {
      message: error.message,
      details: entry.details,
      stack: entry.stack
    });

    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }
  }

  getRecentErrors(limit: number = 10): ErrorLogEntry[] {
    return this.logs.slice(0, limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();