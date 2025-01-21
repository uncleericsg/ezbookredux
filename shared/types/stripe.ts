/**
 * Stripe-specific types
 */

import type { PaymentStatus } from './payment';

/**
 * Stripe payment intent status
 */
export type StripePaymentStatus = 
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

/**
 * Stripe payment intent
 */
export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  status: StripePaymentStatus;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

/**
 * Payment intent response
 */
export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

/**
 * Create payment intent parameters
 */
export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  serviceId: string;
  bookingId: string;
  customerId: string;
  tipAmount?: number;
  metadata?: Record<string, string>;
}

/**
 * Stripe payment element appearance
 */
export interface StripeElementAppearance {
  theme?: 'stripe' | 'night' | 'flat';
  variables?: {
    colorPrimary?: string;
    colorBackground?: string;
    colorText?: string;
    colorDanger?: string;
    fontFamily?: string;
    spacingUnit?: string;
    borderRadius?: string;
  };
  rules?: {
    '.Input'?: {
      border?: string;
      boxShadow?: string;
      padding?: string;
    };
    '.Input:focus'?: {
      border?: string;
      boxShadow?: string;
    };
    '.Input--invalid'?: {
      border?: string;
      boxShadow?: string;
    };
    '.Tab'?: {
      border?: string;
      boxShadow?: string;
    };
    '.Tab:hover'?: {
      border?: string;
      boxShadow?: string;
    };
    '.Tab--selected'?: {
      border?: string;
      boxShadow?: string;
    };
    '.Label'?: {
      color?: string;
    };
  };
}

/**
 * Stripe payment element options
 */
export interface StripePaymentElementOptions {
  layout?: {
    type: 'tabs' | 'accordion';
    defaultCollapsed?: boolean;
    radios?: boolean;
    spacedAccordionItems?: boolean;
  };
  paymentMethodOrder?: string[];
  defaultValues?: {
    billingDetails?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
    };
  };
  business?: {
    name?: string;
  };
  fields?: {
    billingDetails?: 'auto' | 'never';
  };
  terms?: {
    card?: 'auto' | 'always' | 'never';
  };
  wallets?: {
    applePay?: 'auto' | 'never';
    googlePay?: 'auto' | 'never';
  };
}
