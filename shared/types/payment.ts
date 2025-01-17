export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  payment_method_types?: string[];
  metadata?: Record<string, any>;
}

export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: PaymentMethod;
}

export interface PaymentError {
  code: string;
  message: string;
  param?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: PaymentError;
}

export interface PaymentReceipt {
  id: string;
  payment_id: string;
  url: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, any>;
  };
  created: number;
}