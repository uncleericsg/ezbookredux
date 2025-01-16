# Stripe Services Documentation

## Payment Service

The Payment Service handles all Stripe payment-related operations.

### Class: `PaymentService`

#### Methods

##### `createPaymentIntent`
Creates a new payment intent in Stripe.

```typescript
async createPaymentIntent({
  amount,
  currency,
  metadata
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent>
```

**Parameters:**
- `amount`: number - Amount in cents
- `currency`: string - Three-letter currency code (e.g., 'sgd')
- `metadata?`: Record<string, string> - Optional metadata for the payment

**Returns:**
- `Promise<Stripe.PaymentIntent>` - The created payment intent

##### `getPaymentIntent`
Retrieves a payment intent with its charges.

```typescript
async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntentWithCharges>
```

**Parameters:**
- `paymentIntentId`: string - The ID of the payment intent to retrieve

**Returns:**
- `Promise<PaymentIntentWithCharges>` - The payment intent with charges

##### `handleWebhookEvent`
Processes Stripe webhook events.

```typescript
async handleWebhookEvent(event: Stripe.Event): Promise<void>
```

**Parameters:**
- `event`: Stripe.Event - The webhook event from Stripe

**Supported Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Receipt Service

The Receipt Service handles receipt generation and retrieval.

### Class: `ReceiptService`

#### Methods

##### `getReceiptUrl`
Retrieves the Stripe receipt URL for a payment.

```typescript
async getReceiptUrl(paymentIntentId: string): Promise<string>
```

**Parameters:**
- `paymentIntentId`: string - The ID of the payment intent

**Returns:**
- `Promise<string>` - The URL of the receipt

##### `generateReceipt`
Generates a custom PDF receipt.

```typescript
async generateReceipt(paymentIntentId: string): Promise<Buffer>
```

**Parameters:**
- `paymentIntentId`: string - The ID of the payment intent

**Returns:**
- `Promise<Buffer>` - PDF buffer containing the receipt

### Types

#### `ReceiptData`
```typescript
interface ReceiptData {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  booking: {
    scheduled_at: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
      mobile: string;
    };
    service: {
      title: string;
      duration: string;
      price: number;
    };
  };
}
```

#### `CreatePaymentIntentParams`
```typescript
interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}
```

## Error Handling

Both services use the logger utility for error tracking and include comprehensive error messages. All methods may throw errors that should be caught and handled by the calling code.

### Common Error Scenarios

1. **Payment Service:**
   - Invalid payment intent ID
   - Stripe API errors
   - Webhook signature verification failures

2. **Receipt Service:**
   - Payment not found in database
   - PDF generation errors
   - Missing receipt URL

## Environment Variables

The services require the following environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Dependencies

- `stripe`: Stripe API client
- `pdfkit`: PDF generation
- `date-fns`: Date formatting
- `@supabase/supabase-js`: Database access 