/**
 * Payment types
 */
import type { BaseEntity } from './repository';
import type { Booking } from './booking';

/**
 * Payment status
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

/**
 * Payment provider
 */
export type PaymentProvider = 'stripe' | 'paynow' | 'cash';

/**
 * Payment method
 */
export type PaymentMethod = 'card' | 'paynow' | 'cash';

/**
 * Payment currency
 */
export type PaymentCurrency = 'sgd' | 'usd';

/**
 * Payment error codes
 */
export type PaymentErrorCode = 
  | 'INVALID_REQUEST'
  | 'PAYMENT_FAILED'
  | 'NETWORK_ERROR'
  | 'INVALID_SERVICE'
  | 'INVALID_AMOUNT'
  | 'INVALID_CURRENCY'
  | 'CARD_DECLINED'
  | 'INSUFFICIENT_FUNDS'
  | 'EXPIRED_CARD'
  | 'PROCESSING_ERROR'
  | 'SERVICE_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Payment error
 */
export interface PaymentError {
  /**
   * Error code
   */
  code: PaymentErrorCode;

  /**
   * Error message
   */
  message: string;

  /**
   * Original error
   */
  originalError?: unknown;
}

/**
 * Payment intent response
 */
export interface PaymentIntentResponse {
  /**
   * Payment intent ID
   */
  paymentIntentId: string;

  /**
   * Client secret
   */
  clientSecret: string;

  /**
   * Payment status
   */
  status: PaymentStatus;

  /**
   * Payment amount
   */
  amount: number;

  /**
   * Payment currency
   */
  currency: PaymentCurrency;

  /**
   * Payment method
   */
  paymentMethod?: string;

  /**
   * Error details
   */
  error?: PaymentError;
}

/**
 * Create payment intent parameters
 */
export interface CreatePaymentIntentParams {
  /**
   * Payment amount
   */
  amount: number;

  /**
   * Payment currency
   */
  currency: PaymentCurrency;

  /**
   * Service ID
   */
  serviceId: string;

  /**
   * Booking ID
   */
  bookingId: string;

  /**
   * Customer ID
   */
  customerId: string;

  /**
   * Tip amount
   */
  tipAmount?: number;

  /**
   * Payment method
   */
  paymentMethod?: PaymentMethod;

  /**
   * Metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Payment details
 */
export interface PaymentDetails {
  /**
   * Payment ID
   */
  id: string;

  /**
   * Payment amount
   */
  amount: number;

  /**
   * Payment currency
   */
  currency: PaymentCurrency;

  /**
   * Payment status
   */
  status: PaymentStatus;

  /**
   * Payment provider
   */
  provider: PaymentProvider;

  /**
   * Payment method
   */
  method: PaymentMethod;

  /**
   * Payment date
   */
  createdAt: string;

  /**
   * Payment updated date
   */
  updatedAt: string;

  /**
   * Payment completed date
   */
  completedAt?: string;

  /**
   * Payment refunded date
   */
  refundedAt?: string;

  /**
   * Payment cancelled date
   */
  cancelledAt?: string;

  /**
   * Payment metadata
   */
  metadata?: Record<string, unknown>;

  /**
   * Payment error
   */
  error?: PaymentError;
}

/**
 * Payment hook state
 */
export interface PaymentHookState {
  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error state
   */
  error: PaymentError | null;

  /**
   * Process payment function
   */
  processPayment: (params: CreatePaymentIntentParams) => Promise<void>;
}

/**
 * Payment entity
 */
export interface Payment extends BaseEntity {
  /**
   * Booking ID
   */
  bookingId: string;

  /**
   * Customer ID
   */
  customerId: string;

  /**
   * Service ID
   */
  serviceId: string;

  /**
   * Payment amount
   */
  amount: number;

  /**
   * Payment currency
   */
  currency: PaymentCurrency;

  /**
   * Payment status
   */
  status: PaymentStatus;

  /**
   * Payment provider
   */
  provider: PaymentProvider;

  /**
   * Payment method
   */
  method: PaymentMethod;

  /**
   * Provider payment ID
   */
  providerPaymentId?: string;

  /**
   * Provider payment intent ID
   */
  providerPaymentIntentId?: string;

  /**
   * Provider payment method ID
   */
  providerPaymentMethodId?: string;

  /**
   * Provider payment method details
   */
  providerPaymentMethodDetails?: Record<string, unknown>;

  /**
   * Provider shipping details
   */
  providerShipping?: {
    address: Record<string, unknown>;
    name: string;
    carrier: string;
    phone: string;
    tracking_number: string;
  };

  /**
   * Provider billing details
   */
  providerBillingDetails?: {
    address: Record<string, unknown>;
    email: string;
    name: string;
    phone: string;
  };

  /**
   * Provider metadata
   */
  providerMetadata?: Record<string, unknown>;

  /**
   * Error details
   */
  errorDetails?: Record<string, unknown>;

  /**
   * Dispute evidence
   */
  disputeEvidence?: Record<string, unknown>;

  /**
   * Payment metadata
   */
  metadata?: Record<string, unknown>;

  /**
   * Payment completed date
   */
  completedAt?: Date;

  /**
   * Payment refunded date
   */
  refundedAt?: Date;

  /**
   * Payment cancelled date
   */
  cancelledAt?: Date;

  /**
   * Associated booking
   */
  booking?: Booking;
}
