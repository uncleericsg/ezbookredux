import Stripe from 'stripe';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { 
  CreateCheckoutRequest, 
  CheckoutResponse, 
  PaymentStatus,
  PaymentCurrency,
  StripeWebhookEvent
} from '@shared/types/payment';

export interface CreateCheckoutParams extends CreateCheckoutRequest {
  userId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface StripeSession {
  id: string;
  url: string;
  paymentStatus: PaymentStatus;
  metadata: Record<string, string>;
}

export class StripeCheckoutProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  async createCheckoutSession(params: CreateCheckoutParams): Promise<StripeSession> {
    try {
      const { 
        amount, 
        currency, 
        bookingId, 
        userId, 
        customerEmail,
        successUrl,
        cancelUrl,
        metadata = {} 
      } = params;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: customerEmail,
        metadata: {
          ...metadata,
          booking_id: bookingId,
          user_id: userId
        },
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        line_items: [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Appointment Booking',
              metadata: {
                booking_id: bookingId,
                user_id: userId
              }
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
      });

      logger.info('Created Stripe checkout session', {
        sessionId: session.id,
        amount,
        currency
      });

      return {
        id: session.id,
        url: session.url!,
        paymentStatus: this.mapPaymentStatus(session.payment_status),
        metadata: session.metadata
      };
    } catch (error) {
      logger.error('Failed to create checkout session', { error });
      throw new ApiError(
        'Failed to create checkout session',
        'STRIPE_CHECKOUT_ERROR'
      );
    }
  }

  async handleWebhook(payload: string, signature: string): Promise<StripeWebhookEvent> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      ) as StripeWebhookEvent;

      return event;
    } catch (error) {
      logger.error('Failed to handle webhook', { error });
      throw new ApiError(
        'Failed to handle webhook',
        'STRIPE_WEBHOOK_ERROR'
      );
    }
  }

  async getSession(sessionId: string): Promise<StripeSession> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        id: session.id,
        url: session.url!,
        paymentStatus: this.mapPaymentStatus(session.payment_status),
        metadata: session.metadata
      };
    } catch (error) {
      logger.error('Failed to retrieve checkout session', { error });
      throw new ApiError(
        'Failed to retrieve checkout session',
        'STRIPE_SESSION_ERROR'
      );
    }
  }

  private mapPaymentStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
      case 'paid':
      case 'complete':
        return 'completed';
      case 'expired':
        return 'expired';
      case 'unpaid':
      case 'failed':
        return 'failed';
      default:
        return 'pending';
    }
  }
} 