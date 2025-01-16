import type { NextApiRequest, NextApiResponse } from 'next';
import { paymentService } from '@/server/services/payments/paymentService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED'
      }
    });
  }

  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      throw new ApiError('Payment intent ID is required', 'VALIDATION_ERROR');
    }

    const receiptUrl = await paymentService.generateReceipt(paymentIntentId);
    
    logger.info('Receipt generated successfully', { paymentIntentId });
    res.status(200).json({ receiptUrl });
  } catch (error) {
    logger.error('Failed to generate receipt', { error });
    
    if (error instanceof ApiError) {
      return res.status(400).json({
        error: {
          message: error.message,
          code: error.code
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
} 