const PAYMENT_STATES = {
  INITIAL: 'INITIAL',
  REDIRECTING_TO_CHECKOUT: 'REDIRECTING_TO_CHECKOUT',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;

type PaymentState = typeof PAYMENT_STATES[keyof typeof PAYMENT_STATES];

// Stripe Checkout specific constants
const STRIPE_CHECKOUT = {
  SUCCESS_URL: `${window.location.origin}/payment/success`,
  CANCEL_URL: `${window.location.origin}/payment/cancel`,
  MODE: 'payment' as const,
  CURRENCY: 'SGD' as const,
} as const;

export { PAYMENT_STATES, STRIPE_CHECKOUT };
export type { PaymentState };
