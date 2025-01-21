import { NextApiRequest, NextApiResponse } from 'next';
import { StripeCheckoutProvider } from '@/services/payments/providers/stripe/StripeCheckoutProvider';
import { PaymentSessionRepository } from '@/services/repositories/payments/PaymentSessionRepository';
import { handleValidationError } from '@/utils/apiErrors';
import { logger } from '@/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, amount, currency, customerEmail, userId } = req.body;

    // Validate required fields
    if (!bookingId || !amount || !currency || !customerEmail || !userId) {
      throw handleValidationError('Missing required fields');
    }

    // Create Stripe Checkout session
    const { sessionId, checkoutUrl } = await StripeCheckoutProvider.createCheckoutSession({
      bookingId,
      amount,
      currency,
      customerEmail
    });

    // Store payment session in database
    await PaymentSessionRepository.create({
      bookingId,
      userId,
      amount,
      currency,
      stripeSessionId: sessionId
    });

    logger.info('Checkout session created:', { 
      sessionId, 
      bookingId,
      userId 
    });

    return res.json({ checkoutUrl });
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    return res.status(400).json({ error: 'Failed to create checkout session' });
  }
} 