import { Database } from './database';
import { PaymentStatus } from '@shared/types/payment';

export { PaymentStatus };

export type Payment = Database['public']['Tables']['payments']['Row'];

export interface CreatePaymentParams {
  bookingId: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  metadata?: Record<string, any>;
}

export interface PaymentListParams {
  customerId?: string;
  status?: PaymentStatus;
  limit?: number;
  offset?: number;
}

export interface PaymentWithBooking extends Payment {
  booking: {
    id: string;
    reference: string;
    service: {
      title: string;
    };
    customer: {
      id: string;
      email: string;
      full_name: string;
    };
  };
} 