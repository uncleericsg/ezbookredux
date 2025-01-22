import type { NextApiRequest, NextApiResponse } from 'next';
import { StripeCheckoutProvider } from '@services/payments/stripe';
import { logger } from '@utils/logger';
import { createValidationError } from '@utils/apiErrors';
import type { CreateCheckoutSessionRequest } from '@shared/types/payment';
import type { ErrorResponse } from '@shared/types/error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ url: string } | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Method not allowed'
      }
    });
  }

  try {
    const data = req.body as CreateCheckoutSessionRequest;

    // Validate request data
    if (!data.bookingId || !data.customerId || !data.amount) {
      throw createValidationError('Missing required fields', {
        bookingId: !data.bookingId ? 'Required' : undefined,
        customerId: !data.customerId ? 'Required' : undefined,
        amount: !data.amount ? 'Required' : undefined
      });
    }

    const session = await StripeCheckoutProvider.createCheckoutSession(data);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    logger.error('Error creating checkout session:', { error });

    return res.status(500).json({
      error: {
        code: 'STRIPE_PAYMENT_INTENT_ERROR',
        message: 'Failed to create checkout session',
        details: error instanceof Error ? { message: error.message } : undefined
      }
    });
  }
}