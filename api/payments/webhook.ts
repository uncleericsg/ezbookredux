import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

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

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Add your payment success logic here
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        // Add your payment failure logic here
        break;

      // Add other event types as needed
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(400).json({
      error: `Webhook Error: ${error.message}`
    });
  }
} 