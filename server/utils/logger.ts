import type { ServerLogger, LogLevel, LogFormat, LogMetadata, LogEntry, LogQueryOptions } from '@shared/types/logger';

/**
 * Logger implementation
 */
class LoggerImpl implements ServerLogger {
  private currentFormat: LogFormat = 'json';
  private currentLevel: LogLevel = 'info';
  private entries: LogEntry[] = [];

  private readonly levelPriority: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };

  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  verbose(message: string, metadata?: LogMetadata): void {
    this.log('verbose', message, metadata);
  }

  http(message: string, metadata?: LogMetadata): void {
    this.log('http', message, metadata);
  }

  silly(message: string, metadata?: LogMetadata): void {
    this.log('silly', message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    // Check if we should log this level
    if (this.levelPriority[level] > this.levelPriority[this.currentLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata
    };

    this.entries.push(entry);

    // Format and output log
    const output = this.formatLog(entry);
    const consoleMethod = this.getConsoleMethod(level);
    consoleMethod(output);
  }

  private formatLog(entry: LogEntry): string {
    if (this.currentFormat === 'json') {
      return JSON.stringify(entry);
    }

    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(7);
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';

    return `${timestamp} [${level}] ${entry.message}${metadata}`;
  }

  private getConsoleMethod(level: LogLevel): (message: string) => void {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'debug':
        return console.debug;
      default:
        return console.log;
    }
  }

  async getEntries(options?: LogQueryOptions): Promise<LogEntry[]> {
    let filtered = [...this.entries];

    if (options?.startDate) {
      filtered = filtered.filter(entry => entry.timestamp >= options.startDate!);
    }

    if (options?.endDate) {
      filtered = filtered.filter(entry => entry.timestamp <= options.endDate!);
    }

    if (options?.levels?.length) {
      filtered = filtered.filter(entry => options.levels!.includes(entry.level));
    }

    if (options?.search) {
      const search = options.search.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.message.toLowerCase().includes(search) ||
        JSON.stringify(entry.metadata).toLowerCase().includes(search)
      );
    }

    if (options?.metadata) {
      filtered = filtered.filter(entry => {
        if (!entry.metadata) return false;
        return Object.entries(options.metadata!).every(([key, value]) =>
          entry.metadata![key] === value
        );
      });
    }

    filtered.sort((a, b) => {
      const direction = options?.sortDirection === 'desc' ? -1 : 1;
      return direction * (a.timestamp.getTime() - b.timestamp.getTime());
    });

    if (options?.page !== undefined && options?.limit !== undefined) {
      const start = options.page * options.limit;
      filtered = filtered.slice(start, start + options.limit);
    }

    return filtered;
  }

  async getEntryCount(options?: LogQueryOptions): Promise<number> {
    const entries = await this.getEntries(options);
    return entries.length;
  }

  async clearEntries(options?: LogQueryOptions): Promise<void> {
    if (!options) {
      this.entries = [];
      return;
    }

    const toKeep = await this.getEntries({
      ...options,
      page: undefined,
      limit: undefined,
      sortDirection: undefined
    });

    this.entries = this.entries.filter(entry => !toKeep.includes(entry));
  }

  setFormat(format: LogFormat): void {
    this.currentFormat = format;
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  getFormat(): LogFormat {
    return this.currentFormat;
  }

  getLevel(): LogLevel {
    return this.currentLevel;
  }
}

/**
 * Logger instance
 */
export const logger: ServerLogger = new LoggerImpl();
