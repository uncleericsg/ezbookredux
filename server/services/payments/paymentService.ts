import { stripeService } from './stripe/stripeService';
import { receiptService } from './stripe/receiptService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';
import type { Stripe } from 'stripe';

export class PaymentService {
  async createPaymentIntent(amount: number, currency: string = 'sgd', metadata: Record<string, any> = {}) {
    try {
      return await stripeService.createPaymentIntent(amount, currency, metadata);
    } catch (error) {
      logger.error('Payment service: Failed to create payment intent', { error });
      throw error instanceof ApiError ? error : new ApiError('Failed to create payment', 'PAYMENT_ERROR');
    }
  }

  async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('Payment service: Failed to handle webhook event', { error, eventType: event.type });
      throw error instanceof ApiError ? error : new ApiError('Failed to process webhook', 'WEBHOOK_ERROR');
    }
  }

  async generateReceipt(paymentIntentId: string) {
    return await receiptService.generateReceipt(paymentIntentId);
  }

  async getReceiptById(paymentIntentId: string) {
    return await receiptService.getReceiptById(paymentIntentId);
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    logger.info('Payment succeeded', { 
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    // Add any additional success handling logic here
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    logger.error('Payment failed', {
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error
    });
    // Add any additional failure handling logic here
  }
}

export const paymentService = new PaymentService(); 