export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface PaymentDetails {
  id: string;
  amount: number;
  tip_amount?: number;
  currency: string;
  status: PaymentStatus;
  payment_intent_id: string;
  service_id: string;
  booking_id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  serviceId: string;
  bookingId: string;
  customerId: string;
  tipAmount?: number;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
}

export interface PaymentError {
  message: string;
  code: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: PaymentError;
} 