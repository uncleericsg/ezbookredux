import type { AppError } from '@shared/types/error';
import { PaymentSessionRepository } from '@repositories/payments/PaymentSessionRepository';

export class PaymentService {
  private repository: PaymentSessionRepository;

  constructor(repository: PaymentSessionRepository) {
    this.repository = repository;
  }

  async createPaymentSession(data: {
    bookingId: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: string;
  }): Promise<void> {
    try {
      await this.repository.createPaymentSession(data);
    } catch (error) {
      const appError = error as AppError;
      throw new Error(`Failed to create payment session: ${appError.message}`);
    }
  }
}