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
  | 'cancelled'
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
