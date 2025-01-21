import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { supabaseClient } from '@server/config/supabase/client';

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface HealthCheckData {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: HealthStatus;
    api: HealthStatus;
  };
  version: string;
}

interface ApiResponse {
  data?: HealthCheckData;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Health check endpoint
 * GET /api/health
 * Public endpoint that checks the health of the application and its dependencies
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  try {
    // Check database connection
    let dbStatus: HealthStatus = 'healthy';
    try {
      const { error } = await supabaseClient.from('health_checks').select('count').single();
      if (error) {
        dbStatus = 'unhealthy';
        logger.warn('Database health check failed', { error });
      }
    } catch (error) {
      dbStatus = 'unhealthy';
      logger.error('Database connection failed', { error });
    }

    // Determine overall status
    const status: HealthStatus = dbStatus === 'healthy' ? 'healthy' : 'degraded';

    const healthCheck: HealthCheckData = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        api: 'healthy'
      },
      version: process.env.APP_VERSION || '1.0.0'
    };

    // Log appropriate level based on status
    if (status === 'healthy') {
      logger.info('Health check successful', { 
        status,
        dbStatus,
        environment: healthCheck.environment 
      });
    } else {
      logger.warn('Health check indicates degraded service', { 
        status,
        dbStatus,
        environment: healthCheck.environment 
      });
    }
    
    const statusCode = status === 'healthy' ? 200 : 
                      status === 'degraded' ? 207 : 503;

    return res.status(statusCode).json({
      data: healthCheck
    });

  } catch (error) {
    logger.error('Health check failed', { error });
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 500).json({
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      });
    }
    
    return res.status(503).json({
      error: {
        message: 'Health check failed',
        code: 'HEALTH_CHECK_FAILED',
        details: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }
      }
    });
  }
} 