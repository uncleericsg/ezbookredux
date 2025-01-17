import type { BaseEntity } from './common';

export interface PaymentDetails extends BaseEntity {
  id: string;
  user_id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: PaymentStatus;
  refund_id?: string;
  error?: {
    code: string;
    message: string;
  };
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error';
  param?: string;
}

export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  payment_method_types: string[];
  metadata?: Record<string, string>;
}

export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface TransactionRecord extends BaseEntity {
  id: string;
  payment_id: string;
  type: 'payment' | 'refund';
  amount: number;
  currency: string;
  status: PaymentStatus;
  processor_id: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;  // default: 'sgd'
  booking_id: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  intentId: string;
}

export interface RefundRequest {
  amount?: number;  // Optional for partial refunds
  reason?: string;
}

export interface PaymentDetailsResponse {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_intent_id: string;
  created_at: string;
  refunded_amount?: number;
  booking: {
    id: string;
    reference: string;
    service: {
      title: string;
    };
  };
  refunds?: {
    id: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

export interface PaymentListResponse {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  booking_reference: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4: string;
  brand?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  clientSecret: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string | null;
  paymentIntentId: string | null;
  refundId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PaymentConfig {
  currency: string;
  supportedPaymentMethods: string[];
  minimumAmount: number;
  maximumAmount: number;
  processingFee?: number;
}
