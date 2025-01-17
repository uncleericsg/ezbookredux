import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { 
  PaymentProvider, 
  CreatePaymentParams, 
  PaymentIntent,
  RefundParams,
  RefundResult,
  WebhookEvent 
} from '@server/services/payments/interfaces/PaymentProvider';
import Stripe from 'stripe';
import { PaymentStatus } from '@shared/types/payment';

export class StripePaymentProvider implements PaymentProvider {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  }

  async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
    try {
      const { amount, currency = 'usd', bookingId, userId, metadata = {} } = params;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          ...metadata,
          bookingId,
          userId
        },
        payment_method_types: ['card'],
        capture_method: 'automatic'
      });

      logger.info('Created Stripe payment intent', {
        paymentIntentId: paymentIntent.id,
        amount,
        currency
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      logger.error('Failed to create Stripe payment intent', { error });
      throw new ApiError(
        'Failed to create payment intent',
        'STRIPE_PAYMENT_INTENT_ERROR'
      );
    }
  }

  async processWebhook(event: WebhookEvent): Promise<void> {
    try {
      const { type, data } = event;
      const paymentIntent = data as unknown as Stripe.PaymentIntent;
      const status = this.mapStripeStatus(paymentIntent.status);

      switch (type) {
        case 'payment_intent.succeeded':
          await this.updatePaymentStatus(paymentIntent.id, 'succeeded');
          break;
        case 'payment_intent.payment_failed':
          await this.updatePaymentStatus(paymentIntent.id, 'failed');
          break;
        case 'payment_intent.canceled':
          await this.updatePaymentStatus(paymentIntent.id, 'failed');
          break;
        default:
          logger.info('Unhandled webhook event type', { type });
      }
    } catch (error) {
      logger.error('Failed to process webhook event', { error });
      throw new ApiError(
        'Failed to process webhook event',
        'STRIPE_WEBHOOK_ERROR'
      );
    }
  }

  async handleRefund(params: RefundParams): Promise<RefundResult> {
    try {
      const { paymentId, amount, reason, metadata } = params;

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount,
        reason: reason as Stripe.RefundCreateParams.Reason,
        metadata
      });

      logger.info('Created refund', {
        refundId: refund.id,
        paymentIntentId: paymentId,
        amount: refund.amount
      });

      return {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        createdAt: new Date(refund.created * 1000)
      };
    } catch (error) {
      logger.error('Failed to create refund', { error });
      throw new ApiError(
        'Failed to create refund',
        'STRIPE_REFUND_ERROR'
      );
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      logger.error('Failed to retrieve payment details', { error });
      throw new ApiError(
        'Failed to retrieve payment details',
        'STRIPE_PAYMENT_RETRIEVAL_ERROR'
      );
    }
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      logger.info('Constructed webhook event', {
        eventId: event.id,
        type: event.type
      });

      return {
        type: event.type,
        data: event.data.object,
        createdAt: new Date(event.created * 1000)
      };
    } catch (error) {
      logger.error('Failed to construct webhook event', { error });
      throw new ApiError(
        'Invalid webhook payload',
        'STRIPE_WEBHOOK_ERROR'
      );
    }
  }

  private async updatePaymentStatus(paymentIntentId: string, newStatus: PaymentStatus): Promise<void> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      const currentStatus = this.mapStripeStatus(paymentIntent.status);
      
      if (currentStatus !== newStatus) {
        if (newStatus === 'pending') {
          logger.warn('Cannot update payment to pending status', { paymentIntentId });
          return;
        }
        
        if (newStatus === 'failed') {
          await this.stripe.paymentIntents.cancel(paymentIntentId);
        }
      }

      logger.info('Updated Stripe payment status', {
        paymentIntentId,
        oldStatus: currentStatus,
        newStatus
      });
    } catch (error) {
      logger.error('Failed to update payment status', { error });
      throw new ApiError(
        'Failed to update payment status',
        'STRIPE_STATUS_UPDATE_ERROR'
      );
    }
  }

  private mapStripeStatus(stripeStatus: Stripe.PaymentIntent.Status): PaymentStatus {
    switch (stripeStatus) {
      case 'succeeded':
        return 'succeeded';
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
      case 'requires_capture':
        return 'pending';
      case 'canceled':
        return 'canceled';
      default:
        return 'failed';
    }
  }
} 