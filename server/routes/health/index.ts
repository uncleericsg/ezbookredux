import { Router } from 'express';
import { asyncHandler } from '@server/middleware/errorHandling';
import { logger } from '@server/utils/logger';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
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
}));

export default router; 