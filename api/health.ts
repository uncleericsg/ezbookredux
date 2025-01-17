import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

interface HealthCheckData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string | undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  try {
    const healthCheck: HealthCheckData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    };

    logger.info('Health check successful', healthCheck);
    
    return res.status(200).json({
      data: healthCheck
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      });
    }
    
    return res.status(500).json({
      error: {
        message: 'Health check failed',
        code: 'SERVER_ERROR'
      }
    });
  }
} 