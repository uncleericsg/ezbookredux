import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { StripeCheckoutProvider } from '@/services/payments/providers/stripe/StripeCheckoutProvider';
import { PaymentSessionRepository } from '@/services/repositories/payments/PaymentSessionRepository';
import { logger } from '@/utils/logger';

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    const rawBody = await buffer(req);
    const event = StripeCheckoutProvider.constructWebhookEvent(rawBody, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          logger.error('Missing bookingId in session metadata:', session);
          return res.status(400).json({ error: 'Missing bookingId in session metadata' });
        }

        // Update payment session status
        await PaymentSessionRepository.updateStatus(session.id, 'completed');

        // Update booking status (you'll need to implement this)
        // await BookingService.updateStatus(bookingId, 'confirmed');

        logger.info('Payment completed:', { 
          sessionId: session.id, 
          bookingId 
        });
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          logger.error('Missing bookingId in session metadata:', session);
          return res.status(400).json({ error: 'Missing bookingId in session metadata' });
        }

        // Update payment session status
        await PaymentSessionRepository.updateStatus(session.id, 'expired');

        // Update booking status (you'll need to implement this)
        // await BookingService.updateStatus(bookingId, 'payment_failed');

        logger.info('Payment expired:', { 
          sessionId: session.id, 
          bookingId 
        });
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    logger.error('Error handling webhook:', error);
    return res.status(400).json({ error: 'Webhook error' });
  }
} 