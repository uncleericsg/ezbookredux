/**
 * Log levels
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * Log formats
 */
export type LogFormat = 'json' | 'pretty';

/**
 * Log metadata
 */
export interface LogMetadata {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

/**
 * Log entry
 */
export interface LogEntry extends LogMetadata {
  context?: Record<string, unknown>;
  error?: Error;
  stack?: string;
}

/**
 * Log query options
 */
export interface LogQueryOptions {
  level?: LogLevel;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /**
   * Log level
   */
  level: LogLevel;

  /**
   * Log format
   */
  format: LogFormat;

  /**
   * Output file path
   */
  file?: string;

  /**
   * Pretty print options
   */
  pretty?: {
    colorize?: boolean;
    translateTime?: boolean;
    ignore?: string[];
  };

  /**
   * JSON format options
   */
  json?: {
    space?: number;
    replacer?: (key: string, value: unknown) => unknown;
  };
}

/**
 * Server logger interface
 */
export interface ServerLogger {
  error(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
  trace(message: string, metadata?: Record<string, unknown>): void;
  log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void;
  query(options?: LogQueryOptions): Promise<LogEntry[]>;
  getConfig(): LoggerConfig;
  setConfig(config: Partial<LoggerConfig>): void;
}
