import type { Stripe } from 'stripe';
import type { CustomerInfo } from './customer';
import type { ServiceDetails } from './service';

export type PaymentStatus = 
  | 'initializing'
  | 'ready'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type PaymentProvider = 'stripe';

export type PaymentMethod = 
  | 'card'
  | 'paynow'
  | 'grabpay'
  | 'googlepay'
  | 'applepay';

export interface PaymentState {
  status: PaymentStatus;
  clientSecret: string | null;
  error: string | null;
  tipAmount: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentParams {
  bookingId: string;
  serviceId: string;
  amount: number;
  currency?: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface PaymentStepData {
  bookingId?: string;
  customerInfo: CustomerInfo | null;
  selectedService?: ServiceDetails;
  scheduledDateTime?: Date;
  scheduledTimeSlot?: string;
  brands: string[];
  issues: string[];
  otherIssue?: string;
  isFirstTimeFlow?: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error' | 'idempotency_error';
  param?: string;
  detail?: string;
}

export interface PaymentSession {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStepProps {
  bookingData: PaymentStepData;
  onComplete: (reference: string) => void;
  onBack: () => void;
}

export interface PaymentStepContentProps {
  paymentState: PaymentState;
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentState>>;
  bookingData: PaymentStepData;
  onBack: () => void;
  onSuccess: () => void;
}

// Constants
export const PAYMENT_STATES = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, any>;
  };
  created: number;
  livemode: boolean;
}

// Stripe-specific types
export interface StripePaymentIntent extends Omit<PaymentIntent, 'status'> {
  status: Stripe.PaymentIntent.Status;
  stripePaymentIntentId: string;
}

export interface StripeWebhookEvent extends PaymentWebhookEvent {
  data: {
    object: Stripe.PaymentIntent | Stripe.Charge | Stripe.Refund;
  };
}

export interface PaymentConfig {
  provider: PaymentProvider;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  supportedMethods: PaymentMethod[];
} 