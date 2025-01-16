import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { paymentService } from '@/server/services/payments/paymentService';
import { stripeService } from '@/server/services/payments/stripe/stripeService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

// Disable body parsing, need raw body for Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature || Array.isArray(signature)) {
      throw new ApiError('Missing or invalid stripe-signature header', 'VALIDATION_ERROR');
    }

    const event = await stripeService.constructWebhookEvent(rawBody, signature);
    await paymentService.handleWebhookEvent(event);
    
    logger.info('Webhook processed successfully', { eventType: event.type });
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook processing failed', { error });
    
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