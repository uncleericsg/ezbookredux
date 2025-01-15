import Stripe from 'stripe';

import supabase from '../../config/database';
import { ApiError } from '../../utils/apiErrors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

interface PaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (params: PaymentIntentParams) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata || {}
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    throw new ApiError('Payment processing failed', 500, 'PAYMENT_ERROR', error);
  }
};

export const handleWebhook = async (signature: string, body: Buffer) => {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};