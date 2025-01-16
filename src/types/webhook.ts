import type { Stripe } from 'stripe';

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'payment_intent.succeeded'
  | 'payment_intent.failed'
  | 'payment_intent.canceled'
  | 'charge.succeeded'
  | 'charge.failed'
  | 'charge.refunded'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted';

/**
 * Webhook event payload
 */
export interface WebhookEventPayload<T = any> {
  id: string;
  type: WebhookEventType;
  created: number;
  data: {
    object: T;
  };
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key: string;
  };
}

/**
 * Stripe webhook event with typed data
 */
export interface StripeWebhookEvent<T = Record<string, any>> extends Omit<Stripe.Event, 'data'> {
  data: {
    object: T;
  };
}

/**
 * Payment intent webhook events
 */
export type PaymentIntentWebhookEvent = StripeWebhookEvent<Stripe.PaymentIntent>;
export type ChargeWebhookEvent = StripeWebhookEvent<Stripe.Charge>;

/**
 * Webhook handler response
 */
export interface WebhookHandlerResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  data?: any;
}

/**
 * Webhook verification
 */
export interface WebhookVerification {
  timestamp: string;
  signature: string;
  event_id: string;
  is_valid: boolean;
}

export interface WebhookConfig {
  endpoint_url: string;
  secret_key: string;
  enabled_events: WebhookEventType[];
  metadata?: Record<string, any>;
}

export interface WebhookLog {
  id: string;
  event_type: WebhookEventType;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  payload: WebhookEventPayload;
  response?: WebhookHandlerResponse;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  retry_count: number;
  next_retry?: string;
} 