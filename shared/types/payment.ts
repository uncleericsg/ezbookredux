import type { ErrorResponse } from './error';

/**
 * Payment status
 */
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'cancelled';

/**
 * Payment method
 */
export type PaymentMethod = 
  | 'card'
  | 'bank_transfer'
  | 'cash';

/**
 * Payment currency
 */
export type PaymentCurrency = 'SGD' | 'USD';

/**
 * Base payment interface
 */
export interface Payment {
  id: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  method?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create checkout session request
 */
export interface CreateCheckoutSessionRequest {
  bookingId: string;
  customerId: string;
  amount: number;
  currency?: PaymentCurrency;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Create checkout session response
 */
export interface CreateCheckoutSessionResponse {
  url: string;
  sessionId: string;
}

/**
 * Payment session
 */
export interface PaymentSession {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  sessionId: string;
  paymentIntentId?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment webhook event
 */
export interface PaymentWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

/**
 * Payment webhook response
 */
export type PaymentWebhookResponse = 
  | { received: true }
  | ErrorResponse;

/**
 * Payment provider interface
 */
export interface PaymentProvider {
  createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse>;
  
  handleWebhookEvent(
    event: PaymentWebhookEvent
  ): Promise<PaymentWebhookResponse>;
  
  getPaymentSession(
    sessionId: string
  ): Promise<PaymentSession>;
}
