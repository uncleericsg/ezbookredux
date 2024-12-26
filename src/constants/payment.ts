const PAYMENT_STATES = {
  INITIAL: 'INITIAL',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;

type PaymentState = typeof PAYMENT_STATES[keyof typeof PAYMENT_STATES];

export { PAYMENT_STATES };
export type { PaymentState };
