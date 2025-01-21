/**
 * Log level
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'http' | 'silly';

/**
 * Log format
 */
export type LogFormat = 'json' | 'text';

/**
 * Log metadata
 */
export interface LogMetadata {
  [key: string]: any;
}

/**
 * Log entry
 */
export interface LogEntry {
  /**
   * Log level
   */
  level: LogLevel;

  /**
   * Log message
   */
  message: string;

  /**
   * Log timestamp
   */
  timestamp: Date;

  /**
   * Log metadata
   */
  metadata?: LogMetadata;
}

/**
 * Log query options
 */
export interface LogQueryOptions {
  /**
   * Start date
   */
  startDate?: Date;

  /**
   * End date
   */
  endDate?: Date;

  /**
   * Log levels to include
   */
  levels?: LogLevel[];

  /**
   * Search text
   */
  search?: string;

  /**
   * Metadata filters
   */
  metadata?: Record<string, any>;

  /**
   * Page number
   */
  page?: number;

  /**
   * Page size
   */
  limit?: number;

  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Logger interface
 */
export interface Logger {
  /**
   * Log error message
   */
  error(message: string, metadata?: LogMetadata): void;

  /**
   * Log warning message
   */
  warn(message: string, metadata?: LogMetadata): void;

  /**
   * Log info message
   */
  info(message: string, metadata?: LogMetadata): void;

  /**
   * Log debug message
   */
  debug(message: string, metadata?: LogMetadata): void;

  /**
   * Log verbose message
   */
  verbose(message: string, metadata?: LogMetadata): void;

  /**
   * Log HTTP message
   */
  http(message: string, metadata?: LogMetadata): void;

  /**
   * Log silly message
   */
  silly(message: string, metadata?: LogMetadata): void;
}

/**
 * Server logger interface
 */
export interface ServerLogger extends Logger {
  /**
   * Get log entries
   */
  getEntries(options?: LogQueryOptions): Promise<LogEntry[]>;

  /**
   * Get log entry count
   */
  getEntryCount(options?: LogQueryOptions): Promise<number>;

  /**
   * Clear log entries
   */
  clearEntries(options?: LogQueryOptions): Promise<void>;

  /**
   * Set log format
   */
  setFormat(format: LogFormat): void;

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void;

  /**
   * Get current log format
   */
  getFormat(): LogFormat;

  /**
   * Get current minimum log level
   */
  getLevel(): LogLevel;
}
