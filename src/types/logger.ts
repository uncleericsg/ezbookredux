import type { ErrorMetadata } from './error';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  level?: LogLevel;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private level: LogLevel;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || (process.env.NODE_ENV === 'development' ? 'debug' : 'info');
  }

  debug(message: string, metadata?: ErrorMetadata): void {
    if (this.shouldLog('debug')) {
      console.debug(message, metadata);
    }
  }

  info(message: string, metadata?: ErrorMetadata): void {
    if (this.shouldLog('info')) {
      console.info(message, metadata);
    }
  }

  warn(message: string, metadata?: ErrorMetadata): void {
    if (this.shouldLog('warn')) {
      console.warn(message, metadata);
    }
  }

  error(message: string, metadata?: ErrorMetadata): void {
    if (this.shouldLog('error')) {
      console.error(message, metadata);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}

export const logger = new Logger(); 