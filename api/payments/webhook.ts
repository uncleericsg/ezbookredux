import type { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '@server/services/payments/PaymentService';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { buffer } from 'micro';
import { PaymentError } from '@shared/types/payment';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface WebhookResponse {
  received?: boolean;
  error?: PaymentError;
}

/**
 * Stripe webhook handler for processing payment events
 * Does not require authentication as it uses Stripe signature for verification
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>
) {
  const paymentService = new PaymentService();

  try {
    // Validate request method
    if (req.method !== 'POST') {
      logger.warn('Invalid webhook request method', { method: req.method });
      return res.status(405).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Method not allowed'
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
          code: 'WEBHOOK_VERIFICATION_FAILED',
          message: 'Missing Stripe signature'
        }
      });
    }

    if (Array.isArray(signature)) {
      logger.warn('Invalid Stripe signature format');
      return res.status(400).json({
        error: {
          code: 'WEBHOOK_VERIFICATION_FAILED',
          message: 'Invalid Stripe signature format'
        }
      });
    }

    // Process webhook using our refactored PaymentService
    await paymentService.handleWebhook(rawBody.toString(), signature);
    return res.status(200).json({ received: true });

  } catch (error) {
    logger.error('Failed to process webhook', { error });
    
    // Handle known errors
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 500).json({
        error: {
          code: 'WEBHOOK_VERIFICATION_FAILED',
          message: error.message,
          details: { code: error.code }
        }
      });
    }

    // Handle unknown errors
    return res.status(500).json({
      error: {
        code: 'WEBHOOK_VERIFICATION_FAILED',
        message: 'Failed to process webhook'
      }
    });
  }
} 