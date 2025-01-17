import Stripe from 'stripe';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';

export interface CreateCheckoutParams {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  paymentStatus: string;
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

  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSession> {
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
          bookingId,
          userId
        },
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        line_items: [{
          price_data: {
            currency,
            product_data: {
              name: 'Appointment Booking',
              metadata: {
                bookingId,
                userId
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
        paymentStatus: session.payment_status,
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

  async handleWebhook(payload: string, signature: string): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          // Here you would update your booking status
          // The bookingId is available in session.metadata.bookingId
          logger.info('Payment completed', {
            sessionId: session.id,
            bookingId: session.metadata.bookingId
          });
          break;
        
        case 'checkout.session.expired':
          // Handle expired checkout sessions
          logger.info('Checkout session expired', {
            sessionId: event.data.object.id
          });
          break;
      }
    } catch (error) {
      logger.error('Failed to handle webhook', { error });
      throw new ApiError(
        'Failed to handle webhook',
        'STRIPE_WEBHOOK_ERROR'
      );
    }
  }

  async getSession(sessionId: string): Promise<CheckoutSession> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        id: session.id,
        url: session.url!,
        paymentStatus: session.payment_status,
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
} 