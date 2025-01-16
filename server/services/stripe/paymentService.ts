import Stripe from 'stripe';
import { logger } from '@/server/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentWithCharges extends Stripe.PaymentIntent {
  charges: Stripe.ApiList<Stripe.Charge>;
}

export class PaymentService {
  /**
   * Create a payment intent
   */
  async createPaymentIntent({ amount, currency, metadata }: CreatePaymentIntentParams) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info('Payment intent created', { paymentIntentId: paymentIntent.id });
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent', { error });
      throw error;
    }
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['charges']
      }) as PaymentIntentWithCharges;

      logger.info('Payment intent retrieved', { paymentIntentId });
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to retrieve payment intent', { error, paymentIntentId });
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
      }
      logger.info('Webhook event handled', { eventType: event.type });
    } catch (error) {
      logger.error('Failed to handle webhook event', { error, eventType: event.type });
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    // Implement payment success logic
    logger.info('Payment succeeded', { paymentIntentId: paymentIntent.id });
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    // Implement payment failure logic
    logger.error('Payment failed', { paymentIntentId: paymentIntent.id });
  }
}

export const paymentService = new PaymentService();