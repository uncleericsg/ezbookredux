import { StripeCheckoutProvider } from '@server/services/payments/providers/stripe/StripeCheckoutProvider';
import { PaymentSessionRepository } from '@server/services/payments/repositories/PaymentSessionRepository';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import type {
  CreateCheckoutRequest,
  CheckoutResponse,
  PaymentSession,
  PaymentService as IPaymentService,
  PaymentStatus,
  PaymentCurrency,
  StripeWebhookEvent,
  DatabasePaymentSession
} from '@shared/types/payment';

export class PaymentService implements IPaymentService {
  private checkoutProvider: StripeCheckoutProvider;
  private sessionRepository: PaymentSessionRepository;

  constructor() {
    this.checkoutProvider = new StripeCheckoutProvider();
    this.sessionRepository = new PaymentSessionRepository();
  }

  async initiatePayment(
    params: CreateCheckoutRequest & { userId: string }
  ): Promise<CheckoutResponse> {
    try {
      logger.info('Initiating payment for booking', { bookingId: params.bookingId });

      // Validate currency
      if (params.currency !== 'SGD') {
        logger.warn('Invalid currency', { currency: params.currency });
        throw new ApiError('Only SGD currency is accepted', 'VALIDATION_ERROR');
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const successUrl = `${baseUrl}/bookings/${params.bookingId}/success`;
      const cancelUrl = `${baseUrl}/bookings/${params.bookingId}/cancel`;

      const session = await this.checkoutProvider.createCheckoutSession({
        ...params,
        successUrl,
        cancelUrl
      });
      
      await this.sessionRepository.createSession({
        booking_id: params.bookingId,
        user_id: params.userId,
        amount: params.amount,
        currency: params.currency,
        stripe_session_id: session.id,
        status: session.paymentStatus
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url
      };
    } catch (error) {
      logger.error('Failed to initiate payment', { error: String(error), bookingId: params.bookingId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to initiate payment', 'INTERNAL_SERVER_ERROR');
    }
  }

  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    try {
      logger.info('Processing webhook event');
      
      const event = await this.checkoutProvider.handleWebhook(rawBody, signature);
      
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await this.sessionRepository.updateSessionStatus(
          session.id,
          'completed'
        );
        logger.info('Payment completed successfully', { 
          sessionId: session.id,
          bookingId: session.metadata.booking_id 
        });
      }
      
      if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        await this.sessionRepository.updateSessionStatus(
          session.id,
          'expired'
        );
        logger.info('Payment session expired', { 
          sessionId: session.id,
          bookingId: session.metadata.booking_id 
        });
      }
    } catch (error) {
      logger.error('Failed to process webhook', { error: String(error) });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to process webhook', 'INTERNAL_SERVER_ERROR');
    }
  }

  async getPaymentSession(sessionId: string): Promise<PaymentSession> {
    try {
      const session = await this.sessionRepository.getSession(sessionId);
      return this.mapSession(session);
    } catch (error) {
      logger.error('Failed to get payment session', { error: String(error), sessionId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Payment session not found', 'NOT_FOUND');
    }
  }

  private mapSession(session: DatabasePaymentSession): PaymentSession {
    return {
      id: session.id,
      booking_id: session.booking_id,
      user_id: session.user_id,
      amount: session.amount,
      currency: session.currency,
      status: session.status,
      stripe_session_id: session.stripe_session_id,
      created_at: session.created_at,
      updated_at: session.updated_at
    };
  }
}
