import type { ErrorMetadata } from '@/types/error';

interface LoggerOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  metadata?: Record<string, any>;
}

class Logger {
  private level: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info';
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.level === 'debug') {
      console.debug(message, metadata);
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    if (['debug', 'info'].includes(this.level)) {
      console.info(message, metadata);
    }
  }

  warn(message: string, metadata?: Record<string, any>) {
    if (['debug', 'info', 'warn'].includes(this.level)) {
      console.warn(message, metadata);
    }
  }

  error(message: string, error?: Error | ErrorMetadata) {
    if (['debug', 'info', 'warn', 'error'].includes(this.level)) {
      console.error(message, error);
    }
  }
}

export const logger = new Logger({ level: import.meta.env.DEV ? 'debug' : 'info' }); 