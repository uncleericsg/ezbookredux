export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: 'card' | 'paynow';
  metadata?: Record<string, string>;
}

export interface ServiceDetails {
  type: string;
  date: string;
  time: string;
  duration: number;
}

export interface TransactionRecord {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
  details: ServiceDetails;
}

export interface SavedPaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface PaymentError {
  code: string;
  message: string;
  technical?: string;
  paymentIntentId?: string;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'cancelled';
