import { PaymentStatus } from '@shared/types/payment';

export interface CreatePaymentParams {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, string>;
}

export interface RefundParams {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResult {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

export interface PaymentProvider {
  /**
   * Creates a new payment intent for a booking
   * @param params Payment creation parameters
   * @returns Created payment intent
   * @throws ApiError if creation fails
   */
  createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent>;

  /**
   * Processes a webhook event from the payment provider
   * @param event Webhook event data
   * @throws ApiError if processing fails
   */
  processWebhook(event: WebhookEvent): Promise<void>;

  /**
   * Handles refund for a payment
   * @param params Refund parameters
   * @returns Refund result
   * @throws ApiError if refund fails
   */
  handleRefund(params: RefundParams): Promise<RefundResult>;

  /**
   * Retrieves payment details from the provider
   * @param paymentId Payment ID to retrieve
   * @returns Payment details
   * @throws ApiError if retrieval fails
   */
  getPaymentDetails(paymentId: string): Promise<PaymentIntent>;

  /**
   * Validates webhook signature and constructs event
   * @param payload Raw webhook payload
   * @param signature Webhook signature header
   * @returns Constructed webhook event
   * @throws ApiError if validation fails
   */
  constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent>;
} 