import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/server/utils/logger';

type HealthCheckResponse = {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string | undefined;
} | {
  status: string;
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    };

    logger.info('Health check successful', healthCheck);
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'Health check failed'
    });
  }
} 