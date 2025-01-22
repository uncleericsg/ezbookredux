import type { AppError } from '@shared/types/error';
import { db } from '@server/db';

export class PaymentSessionRepository {
  async createPaymentSession(data: {
    bookingId: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: string;
  }): Promise<void> {
    try {
      await db.paymentSessions.create({
        data: {
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          stripeSessionId: data.stripeSessionId,
          status: data.status,
        },
      });
    } catch (error) {
      const appError = error as AppError;
      throw new Error(`Failed to create payment session: ${appError.message}`);
    }
  }
}