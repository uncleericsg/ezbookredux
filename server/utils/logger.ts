import { ErrorMetadata } from '../types/error';

export interface Logger {
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: ErrorMetadata): void;
  debug(message: string, metadata?: Record<string, any>): void;
}

const formatMetadata = (metadata?: Record<string, any>): string => {
  if (!metadata) return '';
  try {
    return JSON.stringify(metadata, null, 2);
  } catch (err) {
    return String(metadata);
  }
};

const formatError = (error: unknown): ErrorMetadata => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return {
    message: String(error),
  };
};

class ConsoleLogger implements Logger {
  info(message: string, metadata?: Record<string, any>): void {
    console.info(`[INFO] ${message}${formatMetadata(metadata)}`);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    console.warn(`[WARN] ${message}${formatMetadata(metadata)}`);
  }

  error(message: string, metadata?: ErrorMetadata): void {
    const formattedError = metadata instanceof Error ? formatError(metadata) : metadata;
    console.error(`[ERROR] ${message}${formatMetadata(formattedError)}`);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}${formatMetadata(metadata)}`);
    }
  }
}

export const logger: Logger = new ConsoleLogger(); 