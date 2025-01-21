import type { AppError, DatabaseError } from '@shared/types/error';

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },

  warn: (message: string, metadata?: Record<string, unknown>) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },

  error: (error: unknown, metadata?: Record<string, unknown>) => {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) };

    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      ...errorData,
      ...metadata
    }));
  },

  debug: (message: string, metadata?: Record<string, unknown>) => {
    console.debug(JSON.stringify({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  }
};