import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { paymentService } from '@/server/services/stripe/paymentService';
import { logger } from '@/server/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event using payment service
    await paymentService.handleWebhookEvent(event);
    
    logger.info('Webhook processed successfully', { eventType: event.type });
    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Webhook error:', { error: error.message });
    res.status(400).json({
      error: `Webhook Error: ${error.message}`
    });
  }
} 