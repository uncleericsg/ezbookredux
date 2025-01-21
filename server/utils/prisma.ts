import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

/**
 * Prisma event types
 */
interface PrismaQueryEvent {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
}

interface PrismaLogEvent {
  timestamp: Date;
  message: string;
  target?: string;
}

/**
 * Create Prisma client with logging
 */
const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' }
    ],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  // Log queries in development
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e: PrismaQueryEvent) => {
      logger.debug('Prisma Query', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
        target: e.target,
        timestamp: e.timestamp
      });
    });
  }

  // Log errors
  prisma.$on('error', (e: PrismaLogEvent) => {
    const error = new Error(e.message);
    error.name = 'PrismaError';
    if (e.target) {
      (error as any).target = e.target;
    }
    logger.error('Prisma Error', error);
  });

  // Log info
  prisma.$on('info', (e: PrismaLogEvent) => {
    logger.info('Prisma Info', {
      message: e.message,
      timestamp: e.timestamp,
      ...(e.target && { target: e.target })
    });
  });

  // Log warnings
  prisma.$on('warn', (e: PrismaLogEvent) => {
    logger.warn('Prisma Warning', {
      message: e.message,
      timestamp: e.timestamp,
      ...(e.target && { target: e.target })
    });
  });

  return prisma;
};

/**
 * Global Prisma client instance
 */
export const prisma = createPrismaClient();

/**
 * Ensure proper shutdown
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

/**
 * Handle uncaught errors
 */
process.on('uncaughtException', async (error: Error) => {
  logger.error('Uncaught Exception', error);
  await prisma.$disconnect();
  process.exit(1);
});

/**
 * Handle unhandled rejections
 */
process.on('unhandledRejection', async (reason: Error | any) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logger.error('Unhandled Rejection', error);
  await prisma.$disconnect();
  process.exit(1);
});
