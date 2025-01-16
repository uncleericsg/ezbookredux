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
    const { amount, currency = 'sgd', metadata = {} } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new ApiError('Invalid amount', 'VALIDATION_ERROR');
    }

    const paymentIntent = await paymentService.createPaymentIntent(amount, currency, metadata);
    
    logger.info('Payment intent created via API', { 
      paymentIntentId: paymentIntent.id,
      amount,
      currency 
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    logger.error('Failed to create payment intent via API', { error });
    
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