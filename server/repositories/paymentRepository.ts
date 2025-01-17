import { Database } from '@server/types/database';
import { logger } from '@server/utils/logger';
import { ApiError, ApiErrorCode } from '@server/utils/apiErrors';
import { PaymentStatus } from '@shared/types/payment';
import {
  Payment,
  CreatePaymentParams,
  PaymentListParams,
  PaymentWithBooking
} from '@server/types/payment';

export class PaymentRepository {
  constructor(
    private readonly db: Database,
    private readonly logger: typeof logger
  ) {}

  async createPayment(data: CreatePaymentParams): Promise<Payment> {
    try {
      const { data: payment, error } = await this.db
        .from('payments')
        .insert({
          booking_id: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          status: 'pending',
          payment_intent_id: data.paymentIntentId,
          metadata: data.metadata
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create payment record', { error, data });
        throw new ApiError('Failed to create payment record', ApiErrorCode.DATABASE_ERROR);
      }

      this.logger.info('Created payment record', { paymentId: payment.id });
      return payment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error creating payment', { error });
      throw new ApiError('Failed to create payment', ApiErrorCode.SERVER_ERROR);
    }
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    try {
      const { error } = await this.db
        .from('payments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to update payment status', { error, id, status });
        throw new ApiError('Failed to update payment status', ApiErrorCode.DATABASE_ERROR);
      }

      this.logger.info('Updated payment status', { paymentId: id, status });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error updating payment status', { error });
      throw new ApiError('Failed to update payment status', ApiErrorCode.SERVER_ERROR);
    }
  }

  async getPaymentDetails(id: string): Promise<PaymentWithBooking> {
    try {
      const { data: payment, error } = await this.db
        .from('payments')
        .select(`
          *,
          booking:bookings (
            id,
            reference:id,
            service:services (
              title
            ),
            customer:customers (
              id,
              email,
              full_name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error('Failed to fetch payment details', { error, id });
        throw new ApiError('Failed to fetch payment details', ApiErrorCode.DATABASE_ERROR);
      }

      if (!payment) {
        throw new ApiError('Payment not found', ApiErrorCode.NOT_FOUND);
      }

      this.logger.info('Fetched payment details', { paymentId: id });
      return payment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error fetching payment details', { error });
      throw new ApiError('Failed to fetch payment details', ApiErrorCode.SERVER_ERROR);
    }
  }

  async listPayments(params: PaymentListParams): Promise<Payment[]> {
    try {
      let query = this.db
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          status,
          created_at,
          updated_at,
          payment_intent_id,
          booking:bookings (
            id,
            reference:id
          )
        `);

      // Add filters
      if (params.customerId) {
        query = query.eq('customer_id', params.customerId);
      }

      if (params.status) {
        query = query.eq('status', params.status);
      }

      // Add sorting
      query = query.order('created_at', { ascending: false });

      // Add pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const { data: payments, error } = await query;

      if (error) {
        this.logger.error('Failed to list payments', { error, params });
        throw new ApiError('Failed to list payments', ApiErrorCode.DATABASE_ERROR);
      }

      this.logger.info('Listed payments', { count: payments?.length });
      return payments || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error listing payments', { error });
      throw new ApiError('Failed to list payments', ApiErrorCode.SERVER_ERROR);
    }
  }

  async getPaymentByIntentId(paymentIntentId: string): Promise<Payment | null> {
    try {
      const { data: payment, error } = await this.db
        .from('payments')
        .select()
        .eq('payment_intent_id', paymentIntentId)
        .single();

      if (error) {
        this.logger.error('Failed to fetch payment by intent ID', { error, paymentIntentId });
        throw new ApiError('Failed to fetch payment', ApiErrorCode.DATABASE_ERROR);
      }

      return payment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error fetching payment by intent ID', { error });
      throw new ApiError('Failed to fetch payment', ApiErrorCode.SERVER_ERROR);
    }
  }

  async updatePaymentMetadata(id: string, metadata: Record<string, any>): Promise<void> {
    try {
      const { error } = await this.db
        .from('payments')
        .update({ 
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to update payment metadata', { error, id });
        throw new ApiError('Failed to update payment metadata', ApiErrorCode.DATABASE_ERROR);
      }

      this.logger.info('Updated payment metadata', { paymentId: id });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error updating payment metadata', { error });
      throw new ApiError('Failed to update payment metadata', ApiErrorCode.SERVER_ERROR);
    }
  }
}

// Export singleton instance
export const paymentRepository = new PaymentRepository(
  global.supabase as Database,
  logger
); 