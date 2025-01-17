import { StripeCheckoutProvider } from '@server/services/payments/providers/stripe/StripeCheckoutProvider';
import { PaymentSessionRepository } from '@server/services/payments/repositories/PaymentSessionRepository';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';

export class PaymentService {
  private checkoutProvider: StripeCheckoutProvider;
  private sessionRepository: PaymentSessionRepository;

  constructor() {
    this.checkoutProvider = new StripeCheckoutProvider();
    this.sessionRepository = new PaymentSessionRepository();
  }

  async initiatePayment(params: {
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    try {
      logger.info('Initiating payment for booking', { bookingId: params.bookingId });
      
      const session = await this.checkoutProvider.createCheckoutSession(params);
      
      await this.sessionRepository.createSession({
        stripeSessionId: session.id,
        bookingId: params.bookingId,
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        status: session.paymentStatus,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url
      };
    } catch (error) {
      logger.error('Failed to initiate payment', { error, bookingId: params.bookingId });
      throw new ApiError('Failed to initiate payment', 'PAYMENT_INITIATION_FAILED');
    }
  }

  async handleWebhook(rawBody: string, signature: string) {
    try {
      logger.info('Processing webhook event');
      
      const event = await this.checkoutProvider.handleWebhook(rawBody, signature);
      
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        await this.sessionRepository.updateSessionStatus(
          session.id,
          'completed'
        );
        logger.info('Payment completed successfully', { sessionId: session.id });
      }
      
      if (event.type === 'checkout.session.expired') {
        const session = event.data.object as any;
        await this.sessionRepository.updateSessionStatus(
          session.id,
          'expired'
        );
        logger.info('Payment session expired', { sessionId: session.id });
      }
    } catch (error) {
      logger.error('Failed to process webhook', { error });
      throw new ApiError('Failed to process webhook', 'WEBHOOK_PROCESSING_FAILED');
    }
  }

  async getPaymentStatus(sessionId: string) {
    try {
      const session = await this.checkoutProvider.getSession(sessionId);
      return {
        status: session.paymentStatus,
        metadata: session.metadata
      };
    } catch (error) {
      logger.error('Failed to get payment status', { error, sessionId });
      throw new ApiError('Failed to get payment status', 'PAYMENT_STATUS_FAILED');
    }
  }
} 