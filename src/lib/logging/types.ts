/**
 * Types for fantasy-themed logging system
 */

export interface LogMetadata {
  id: string;
  timestamp: string;
  fantasyName: string;
  category: string;
  author: string;
}

export interface FileChange {
  path: string;
  diff: string;
  checksum: string;
  previousChecksum?: string;
}

export interface ChangeSet {
  files: FileChange[];
  dependencies: string[];
  rollbackSteps: string[];
}

export interface LogContext {
  description: string;
  motivation: string;
  relatedLogs: string[];
}

export interface LogEntry {
  metadata: LogMetadata;
  changes: ChangeSet;
  context: LogContext;
}

export interface RollbackOptions {
  dryRun?: boolean;
  verbose?: boolean;
  force?: boolean;
}