import Stripe from 'stripe';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

// Initialize Stripe with error handling
const initializeStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!secretKey || !webhookSecret) {
    throw new Error('STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables are required');
  }

  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    typescript: true
  });
};

class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = initializeStripe();
  }

  async createPaymentIntent(amount: number, currency: string = 'sgd', metadata: Record<string, any> = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata
      });

      logger.info('Payment intent created', { 
        paymentIntentId: paymentIntent.id,
        amount,
        currency 
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent', { error });
      throw new ApiError('Failed to create payment intent', 'PAYMENT_ERROR');
    }
  }

  async constructWebhookEvent(payload: string | Buffer, signature: string) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logger.error('Failed to construct webhook event', { error });
      throw new ApiError('Invalid webhook signature', 'WEBHOOK_ERROR');
    }
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      logger.error('Failed to retrieve payment intent', { error, paymentIntentId });
      throw new ApiError('Failed to retrieve payment intent', 'PAYMENT_ERROR');
    }
  }
}

export const stripeService = new StripeService(); 