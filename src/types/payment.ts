import type { BaseEntity } from './common';

export interface PaymentDetails extends BaseEntity {
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  booking_id: string;
  customer_id?: string;
  service_id: string;
  tip_amount?: number;
  created_at: Date;
  updated_at: Date;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';

export interface PaymentError {
  code: string;
  message: string;
  payment_intent_id?: string;
  details?: Record<string, unknown>;
}

export interface TransactionRecord extends BaseEntity {
  payment_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: TransactionType;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'chargeback'
  | 'adjustment';

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
