import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import type { LogEntry, RollbackOptions, FileChange } from './types';

export class LogManager {
  private static instance: LogManager;
  private readonly logsDir: string;
  private readonly rollbacksDir: string;

  private constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.rollbacksDir = path.join(this.logsDir, 'ROLLBACKS');
  }

  public static getInstance(): LogManager {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }
    return LogManager.instance;
  }

  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.logsDir, { recursive: true });
    await fs.mkdir(this.rollbacksDir, { recursive: true });
  }

  private async calculateFileChecksum(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return createHash('sha256').update(content).digest('hex');
    } catch (error) {
      console.error(`Failed to calculate checksum for ${filePath}:`, error);
      throw error;
    }
  }

  private generateFantasyName(category: string): string {
    const fantasyNames = {
      system: ['Dragon', 'Wyvern', 'Drake'],
      recovery: ['Phoenix', 'Pegasus', 'Unicorn'],
      security: ['Griffon', 'Sentinel', 'Guardian'],
      api: ['Kraken', 'Leviathan', 'Serpent'],
      ui: ['Fairy', 'Sprite', 'Nymph'],
      database: ['Basilisk', 'Wyrm', 'Hydra']
    };

    const names = fantasyNames[category as keyof typeof fantasyNames] || ['Chimera'];
    return names[Math.floor(Math.random() * names.length)];
  }

  public async createLog(
    category: string,
    description: string,
    files: string[],
    rollbackSteps: string[]
  ): Promise<LogEntry> {
    await this.ensureDirectories();

    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0].split('-').slice(-1)[0];
    const id = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const fantasyName = this.generateFantasyName(category);

    const fileChanges: FileChange[] = await Promise.all(
      files.map(async (filePath) => ({
        path: filePath,
        diff: await this.createDiff(filePath),
        checksum: await this.calculateFileChecksum(filePath)
      }))
    );

    const logEntry: LogEntry = {
      metadata: {
        id: `${date}-${id}-${fantasyName}`,
        timestamp,
        fantasyName,
        category,
        author: process.env.USER || 'unknown'
      },
      changes: {
        files: fileChanges,
        dependencies: [],
        rollbackSteps
      },
      context: {
        description,
        motivation: '',
        relatedLogs: []
      }
    };

    const logPath = path.join(this.logsDir, 'CHANGES', `${logEntry.metadata.id}.log`);
    await fs.writeFile(logPath, JSON.stringify(logEntry, null, 2));

    return logEntry;
  }

  private async createDiff(filePath: string): Promise<string> {
    try {
      // Implementation would use git diff or similar
      return 'Diff implementation placeholder';
    } catch (error) {
      console.error(`Failed to create diff for ${filePath}:`, error);
      throw error;
    }
  }

  public async rollback(
    identifier: string,
    options: RollbackOptions = {}
  ): Promise<void> {
    const log = await this.findLog(identifier);
    if (!log) {
      throw new Error(`No log found matching identifier: ${identifier}`);
    }

    if (options.dryRun) {
      console.log('Dry run - would rollback these changes:', log);
      return;
    }

    for (const file of log.changes.files) {
      await this.rollbackFile(file, options);
    }

    // Create rollback record
    const rollbackPath = path.join(
      this.rollbacksDir,
      `rollback-${log.metadata.id}-${Date.now()}.json`
    );
    await fs.writeFile(rollbackPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      rolledBack: log.metadata.id,
      options
    }));
  }

  private async rollbackFile(
    file: FileChange,
    options: RollbackOptions
  ): Promise<void> {
    try {
      const currentChecksum = await this.calculateFileChecksum(file.path);
      if (currentChecksum !== file.checksum && !options.force) {
        throw new Error(
          `File ${file.path} has been modified since the log was created`
        );
      }

      if (options.verbose) {
        console.log(`Rolling back ${file.path}`);
      }

      // Implementation would apply reverse diff
      // For now, just log the action
      console.log(`Would rollback ${file.path}`);
    } catch (error) {
      console.error(`Failed to rollback ${file.path}:`, error);
      throw error;
    }
  }

  private async findLog(identifier: string): Promise<LogEntry | null> {
    const files = await fs.readdir(path.join(this.logsDir, 'CHANGES'));
    const logFile = files.find(f => 
      f.includes(identifier) || 
      f.toLowerCase().includes(identifier.toLowerCase())
    );

    if (!logFile) {
      return null;
    }

    const content = await fs.readFile(
      path.join(this.logsDir, 'CHANGES', logFile),
      'utf-8'
    );
    return JSON.parse(content);
  }
}