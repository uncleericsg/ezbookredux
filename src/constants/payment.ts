export const PAYMENT_STATES = {
  INITIAL: 'INITIAL',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;

export type PaymentState = typeof PAYMENT_STATES[keyof typeof PAYMENT_STATES];
