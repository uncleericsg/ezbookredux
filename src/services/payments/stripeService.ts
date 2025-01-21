import Stripe from 'stripe';
import type {
  CreatePaymentIntentParams
} from '@shared/types/payment';
import { logger } from '@/utils/logger';

interface ServiceResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: APIError;
}

class APIError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface PaymentConfig {
  secretKey: string;
  webhookSecret: string;
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'cancelled' | 'failed';
  clientSecret?: string;
  metadata?: Stripe.MetadataParam;
  createdAt: string;
  updatedAt: string;
}

interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
  metadata?: Stripe.MetadataParam;
}

type StripeWebhookEvent = Stripe.Event;

export class StripeService {
  private stripe: Stripe;
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    if (!config.secretKey || !config.webhookSecret) {
      throw new APIError(
        'INVALID_CONFIG',
        'Stripe configuration is incomplete',
        400,
        { config }
      );
    }

    this.config = config;
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<ServiceResponse<PaymentIntent>> {
    try {
      if (!params.amount || params.amount <= 0) {
        throw new APIError(
          'INVALID_PAYMENT_AMOUNT',
          'Invalid payment amount',
          400,
          { amount: params.amount }
        );
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency || 'sgd',
        metadata: params.metadata as Stripe.MetadataParam,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        status: 'success',
        data: this.mapToPaymentIntent(paymentIntent)
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        logger.error('Stripe error while creating payment intent:', { error, params });
        return {
          status: 'error',
          error: new APIError(
            'STRIPE_ERROR',
            error.message,
            500,
            { code: error.code, type: error.type }
          )
        };
      }
      if (error instanceof APIError) {
        return {
          status: 'error',
          error
        };
      }
      logger.error('Unexpected error while creating payment intent:', { error });
      return {
        status: 'error',
        error: new APIError(
          'UNKNOWN_ERROR',
          'Failed to create payment intent',
          500,
          { originalError: error }
        )
      };
    }
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<ServiceResponse<PaymentIntent>> {
    try {
      if (!paymentIntentId) {
        throw new APIError(
          'MISSING_PAYMENT_INTENT_ID',
          'Payment intent ID is required',
          400
        );
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: 'success',
        data: this.mapToPaymentIntent(paymentIntent)
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        logger.error('Stripe error while retrieving payment intent:', { error, paymentIntentId });
        return {
          status: 'error',
          error: new APIError(
            'STRIPE_ERROR',
            error.message,
            500,
            { code: error.code, type: error.type }
          )
        };
      }
      if (error instanceof APIError) {
        return {
          status: 'error',
          error
        };
      }
      logger.error('Unexpected error while retrieving payment intent:', { error });
      return {
        status: 'error',
        error: new APIError(
          'UNKNOWN_ERROR',
          'Failed to retrieve payment intent',
          500,
          { originalError: error }
        )
      };
    }
  }

  /**
   * Process a refund
   */
  async createRefund(params: RefundParams): Promise<ServiceResponse<void>> {
    try {
      if (!params.paymentIntentId) {
        throw new APIError(
          'MISSING_PAYMENT_INTENT_ID',
          'Payment intent ID is required',
          400
        );
      }

      await this.stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount,
        reason: params.reason as Stripe.RefundCreateParams.Reason,
        metadata: params.metadata
      });

      return {
        status: 'success'
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        logger.error('Stripe error while processing refund:', { error, params });
        return {
          status: 'error',
          error: new APIError(
            'STRIPE_ERROR',
            error.message,
            500,
            { code: error.code, type: error.type }
          )
        };
      }
      if (error instanceof APIError) {
        return {
          status: 'error',
          error
        };
      }
      logger.error('Unexpected error while processing refund:', { error });
      return {
        status: 'error',
        error: new APIError(
          'UNKNOWN_ERROR',
          'Failed to process refund',
          500,
          { originalError: error }
        )
      };
    }
  }

  /**
   * Verify and construct webhook event
   */
  verifyWebhookEvent(payload: string | Buffer, signature: string): ServiceResponse<StripeWebhookEvent> {
    try {
      if (!signature) {
        throw new APIError(
          'MISSING_SIGNATURE',
          'Stripe signature is required',
          400
        );
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );

      return {
        status: 'success',
        data: event
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        logger.error('Stripe signature verification failed:', { error });
        return {
          status: 'error',
          error: new APIError(
            'INVALID_SIGNATURE',
            'Invalid webhook signature',
            400
          )
        };
      }
      if (error instanceof APIError) {
        return {
          status: 'error',
          error
        };
      }
      logger.error('Unexpected error while verifying webhook:', { error });
      return {
        status: 'error',
        error: new APIError(
          'UNKNOWN_ERROR',
          'Failed to verify webhook',
          500,
          { originalError: error }
        )
      };
    }
  }

  /**
   * Map Stripe payment intent to our PaymentIntent type
   */
  private mapToPaymentIntent(stripePaymentIntent: Stripe.PaymentIntent): PaymentIntent {
    return {
      id: stripePaymentIntent.id,
      amount: stripePaymentIntent.amount,
      currency: stripePaymentIntent.currency,
      status: this.mapPaymentStatus(stripePaymentIntent.status),
      clientSecret: stripePaymentIntent.client_secret || undefined,
      metadata: stripePaymentIntent.metadata || undefined,
      createdAt: new Date(stripePaymentIntent.created * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Map Stripe payment status to our PaymentStatus type
   */
  private mapPaymentStatus(stripeStatus: Stripe.PaymentIntent.Status): PaymentIntent['status'] {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'succeeded':
        return 'succeeded';
      case 'canceled':
        return 'cancelled';
      case 'requires_capture':
        return 'processing';
      default:
        return 'failed';
    }
  }
} 