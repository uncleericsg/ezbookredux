import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeService } from '@/server/services/payments/stripe/stripeService';
import { ApiError } from '@/server/utils/apiErrors';
import { logger } from '@/server/utils/logger';
import { buffer } from 'micro';
import type { WebhookResponse } from '@/server/types/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Stripe webhook handler for processing payment events
 * Does not require authentication as it uses Stripe signature for verification
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>
) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      logger.warn('Invalid webhook request method', { method: req.method });
      return res.status(405).json({
        error: {
          message: 'Method not allowed',
          code: 'BAD_REQUEST'
        }
      });
    }

    // Get and validate request body
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      logger.warn('Missing Stripe signature');
      return res.status(400).json({
        error: {
          message: 'Missing Stripe signature',
          code: 'STRIPE_WEBHOOK_ERROR'
        }
      });
    }

    if (Array.isArray(signature)) {
      logger.warn('Invalid Stripe signature format');
      return res.status(400).json({
        error: {
          message: 'Invalid Stripe signature format',
          code: 'STRIPE_WEBHOOK_ERROR'
        }
      });
    }

    // Process webhook
    const event = await stripeService.constructWebhookEvent(rawBody, signature);
    await stripeService.handleStripeWebhook(event);
    
    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Failed to process webhook', { error });
    
    // Handle known errors
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 500).json({
        error: {
          message: error.message,
          code: error.code
        }
      });
    }

    // Handle unknown errors
    return res.status(500).json({
      error: {
        message: 'Failed to process webhook',
        code: 'STRIPE_WEBHOOK_ERROR'
      }
    });
  }
} 