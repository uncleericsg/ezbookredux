# Stripe Integration Documentation
Last Updated: January 17, 2024

## Overview
This document outlines our simplified Stripe integration using Stripe Checkout for handling payments in our appointment booking system. We've chosen Stripe Checkout for its simplicity, security, and built-in features.

## Architecture

### Components
```
server/
├── services/
│   ├── payments/
│   │   ├── providers/
│   │   │   └── stripe/
│   │   │       └── StripeCheckoutProvider.ts   # Stripe integration
│   │   └── PaymentService.ts                   # Main payment orchestrator
│   └── repositories/
│       └── payments/
│           └── PaymentSessionRepository.ts      # Database operations
└── api/
    └── payments/
        ├── checkout.ts                         # Checkout endpoint
        └── webhook.ts                          # Webhook handler
```

### Database Schema
```sql
create table payment_sessions (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references bookings(id),
  user_id uuid references users(id),
  amount integer not null,
  currency text not null,
  status text not null,
  stripe_session_id text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_payment_sessions_booking_id on payment_sessions(booking_id);
create index idx_payment_sessions_stripe_session_id on payment_sessions(stripe_session_id);
```

## Payment Flow

### 1. Initiate Payment
```typescript
// Frontend
const response = await fetch('/api/payments/checkout', {
  method: 'POST',
  body: JSON.stringify({
    bookingId: 'booking_123',
    amount: 5000, // $50.00
    currency: 'usd',
    customerEmail: 'user@example.com'
  })
});

const { checkoutUrl } = await response.json();
window.location.href = checkoutUrl;
```

### 2. Stripe Checkout
- User is redirected to Stripe's hosted checkout page
- Stripe handles:
  - Card processing
  - 3D Secure authentication
  - Error handling
  - Receipt emails

### 3. Payment Completion
- Success: User redirected to `/bookings/[id]/success`
- Cancel: User redirected to `/bookings/[id]/cancel`
- Webhook updates booking status automatically

## Webhook Events

### Handled Events
1. `checkout.session.completed`
   - Payment successful
   - Updates payment status to 'completed'
   - Updates booking status to 'confirmed'

2. `checkout.session.expired`
   - Payment timeout/abandonment
   - Updates payment status to 'expired'
   - Updates booking status to 'payment_failed'

## Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Considerations

1. **Data Handling**
   - No card data touches our servers
   - All sensitive data handled by Stripe

2. **Webhook Security**
   - Signature verification required
   - Idempotency built-in

3. **Session Management**
   - Sessions expire after 24 hours
   - One-time use only

## Error Handling

### Common Error Scenarios
1. Invalid booking status
2. Missing webhook signature
3. Invalid webhook payload
4. Database operation failures

### Error Response Format
```typescript
interface ApiError {
  error: string;
  message: string;
  code: string;
}
```

## Testing

### Test Cards
- Success: `4242 4242 4242 4242`
- Authentication: `4000 0027 6000 3184`
- Decline: `4000 0000 0000 0002`

### Webhook Testing
1. Install Stripe CLI
2. Run: `stripe listen --forward-to localhost:3000/api/payments/webhook`

## Limitations

1. **Customization**
   - Limited UI customization
   - Fixed checkout flow

2. **Payment Methods**
   - Limited to methods supported by Checkout
   - Region-specific limitations apply

3. **Refunds**
   - Manual process through Stripe Dashboard
   - No automated refund flow implemented

## Future Improvements

1. **Features**
   - [ ] Automated refund handling
   - [ ] Custom email templates
   - [ ] Payment analytics

2. **Technical**
   - [ ] Event system for webhook handling
   - [ ] Retry mechanism for failed updates
   - [ ] Enhanced error reporting

## Troubleshooting

### Common Issues
1. Webhook not received
   - Check webhook secret
   - Verify endpoint accessibility

2. Payment status not updated
   - Check webhook logs
   - Verify database connectivity

3. Redirect issues
   - Check APP_URL configuration
   - Verify success/cancel URLs

## Support

### Resources
- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Integration Guide](https://stripe.com/docs/webhooks)

### Internal Contacts
- Technical: dev-team@example.com
- Billing: billing@example.com 