// Simple logger utility that wraps console methods with environment checks
const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(message, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(message, ...args);
    }
  }
};

undefined.displayName = 'undefined';