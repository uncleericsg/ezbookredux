import { Router } from 'express';
import type { Request, Response } from 'express';
import { routeBuilder } from '@server/utils/routeBuilder';
import { routeError } from '@server/utils/routeError';
import { logger } from '@server/utils/logger';
import { prisma } from '@server/utils/prisma';
import type { RouteResponse } from '@shared/types/route';

/**
 * Health check response
 */
interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    api: {
      status: 'ok' | 'error';
      version: string;
      environment: string;
    };
  };
}

/**
 * Health check router
 */
export const healthRouter = Router();

/**
 * Get health status
 * GET /health
 */
const healthCheck = routeBuilder.create<Request, RouteResponse<HealthResponse>>()
  .method('GET')
  .path('/')
  .handler(async (req, res) => {
    try {
      // Check database connection
      const dbStart = Date.now();
      let dbStatus: HealthResponse['services']['database'] = {
        status: 'error'
      };

      try {
        await prisma.$queryRaw`SELECT 1`;
        const dbLatency = Date.now() - dbStart;
        dbStatus = {
          status: 'ok',
          latency: dbLatency
        };
      } catch (error) {
        logger.error('Database health check failed', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        dbStatus.error = error instanceof Error ? error.message : 'Unknown error';
      }

      // Build response
      const response: HealthResponse = {
        status: dbStatus.status === 'ok' ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: dbStatus,
          api: {
            status: 'ok',
            version: process.env.npm_package_version || '0.0.0',
            environment: process.env.NODE_ENV || 'development'
          }
        }
      };

      // Send response
      return {
        data: response
      };
    } catch (error) {
      logger.error('Health check failed', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Health check failed');
    }
  })
  .build();

// Register route
healthRouter.get('/', (req: Request, res: Response) => {
  return healthCheck.handler(req, res)
    .then(response => {
      const status = response.data?.status === 'ok' ? 200 : 503;
      res.status(status).json(response);
    })
    .catch(error => {
      if (error instanceof Error) {
        const status = error.name === 'RouteError' ? (error as any).statusCode || 500 : 500;
        res.status(status).json({
          error: {
            code: (error as any).code || 'INTERNAL_SERVER_ERROR',
            message: error.message
          }
        });
      } else {
        res.status(500).json({
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
          }
        });
      }
    });
});
