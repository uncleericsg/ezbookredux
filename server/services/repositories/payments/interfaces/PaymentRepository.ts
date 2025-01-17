import { PaymentStatus } from '@shared/types/payment';

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  providerPaymentId: string;
  providerRefundId?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentWithBooking extends Payment {
  booking: {
    id: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    status: string;
  };
}

export interface PaymentListParams {
  userId?: string;
  bookingId?: string;
  status?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface PaymentRepository {
  /**
   * Creates a new payment record
   * @param data Payment data to create
   * @returns Created payment record
   * @throws ApiError if creation fails
   */
  createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;

  /**
   * Updates payment status
   * @param id Payment ID to update
   * @param status New payment status
   * @throws ApiError if update fails
   */
  updateStatus(id: string, status: PaymentStatus): Promise<void>;

  /**
   * Updates payment refund information
   * @param id Payment ID to update
   * @param refundId Provider refund ID
   * @throws ApiError if update fails
   */
  updateRefund(id: string, refundId: string): Promise<void>;

  /**
   * Retrieves payment details with booking information
   * @param id Payment ID to retrieve
   * @returns Payment details with booking
   * @throws ApiError if retrieval fails
   */
  getPaymentDetails(id: string): Promise<PaymentWithBooking>;

  /**
   * Lists payments based on filter parameters
   * @param params Filter parameters
   * @returns Array of payments
   * @throws ApiError if listing fails
   */
  listPayments(params: PaymentListParams): Promise<Payment[]>;

  /**
   * Counts total payments matching filter parameters
   * @param params Filter parameters
   * @returns Total count
   * @throws ApiError if counting fails
   */
  countPayments(params: Omit<PaymentListParams, 'limit' | 'offset'>): Promise<number>;
} 