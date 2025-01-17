# Payment Implementation Cleanup Plan
Last Updated: January 17, 2024

## Overview
This document outlines the systematic approach to clean up the old payment implementation while ensuring no disruption to the new Stripe Checkout integration.

## Current Progress

### Phase 1: Preparation (IN PROGRESS)

#### 1. Dependency Analysis Complete ✓
Found the following dependencies that need to be addressed:

##### stripeService Dependencies:
- `src/components/booking/PaymentStep.tsx`: Uses `getStripe`
- `api/payments/webhook.ts`: Uses `constructWebhookEvent` and `handleStripeWebhook` (MIGRATED)
- Multiple documentation references (can be updated)

##### paymentService Dependencies:
- `src/components/booking/PaymentStep.tsx`: Uses `createPaymentIntent`, `addToServiceQueue`
- `src/components/booking/BookingConfirmation.tsx`: Uses `getPaymentReceipt` (NEEDS UPDATE)
- `pages/api/payments/webhook.ts`: Uses webhook handling (MIGRATED)
- `pages/api/payments/checkout.ts`: Uses payment initiation and status checking (MIGRATED)
- `api/payments/create-payment-intent.ts`: Uses payment intent creation
- `api/payments/receipt/generate.ts`: Uses receipt generation

##### receiptService Dependencies:
- `api/payments/receipt/[id].ts`: Uses `getPaymentReceipt`
- `server/services/payments/receiptService.ts`: Main implementation
- Documentation references

#### 2. Required Actions Before Removal:
1. Create new Stripe Checkout implementation (DONE) ✓
2. Migrate webhook handling to new implementation (DONE) ✓
   - Updated webhook endpoint with proper logging
   - Simplified webhook handling in PaymentService
   - Removed direct booking service dependency
   - Added specific error codes and improved error handling
3. Update frontend components to use new checkout flow (IN PROGRESS)
   - BookingConfirmation.tsx exists but needs updates:
     - Update to use new session-based status checking
     - Modify receipt download to use Stripe Checkout receipt URL
     - Update payment details display
   - PaymentStep.tsx needs complete rewrite for Checkout
4. Implement new receipt handling in Checkout flow
5. Update all API endpoints to use new implementation

#### 3. Migration Progress:
- [x] Created new StripeCheckoutProvider
- [x] Created PaymentSessionRepository
- [x] Implemented new PaymentService with Checkout flow
- [x] Updated webhook endpoint
- [x] Added proper logging throughout
- [x] Created BookingConfirmation component
- [x] Updated BookingConfirmation for Checkout flow ✓
  - Replaced payment intent with session-based data
  - Updated to use Stripe's hosted receipt URLs
  - Added session status polling
  - Improved error handling and loading states
- [ ] Create PaymentStep for Checkout (NEXT)
- [ ] Create success/cancel pages
- [ ] Clean up old implementation

### Next Immediate Steps:
1. Create new PaymentStep.tsx for Stripe Checkout:
   - Remove Stripe Elements integration
   - Add redirect to Stripe Checkout
   - Handle success/cancel URLs

2. Create success/cancel pages:
   - Success page using updated BookingConfirmation
   - Cancel page with retry option

3. Testing Requirements:
   ```bash
   # Test webhook handling
   stripe trigger checkout.session.completed
   stripe trigger checkout.session.expired
   
   # Verify session status updates
   curl http://localhost:3000/api/payments/status?session_id=cs_test_...
   
   # Test BookingConfirmation
   - Visit /bookings/:id/success?session_id=cs_test_...
   - Verify payment details display
   - Test receipt URL opening
   ```

## Files to Remove

### 1. Server-side Files
```
server/services/
├── payments/
│   ├── stripe/                 # Old Stripe implementation
│   │   ├── stripeService.ts    # Remove
│   │   └── receiptService.ts   # Remove
│   ├── receiptService.ts       # Remove
│   └── paymentService.ts       # Remove after migration
```

### 2. API Endpoints
```
pages/api/
├── payments/
│   ├── create-payment-intent.ts   # Remove
│   ├── get-payment.ts            # Remove
│   ├── refund.ts                 # Remove
│   └── verify-payment.ts         # Remove
```

### 3. Frontend Files
```
src/
├── services/
│   └── payment/
│       ├── stripeClient.ts      # Remove
│       └── paymentService.ts    # Remove
└── components/
    └── payment/
        ├── PaymentForm.tsx      # Remove
        └── StripeElements.tsx   # Remove
```

## Cleanup Steps

### Phase 1: Preparation
- [x] Verified new implementation working
- [x] Identified all dependencies
- [x] Updated BookingConfirmation component
- [x] Migrated webhook handling

### Phase 2: Backend Cleanup (COMPLETED)
1. Removed Old Services:
   - [x] `server/services/payments/stripe/stripeService.ts`
   - [x] `server/services/payments/stripe/receiptService.ts`
   - [x] `server/services/payments/receiptService.ts`

2. Removed Old API Endpoints:
   - [x] `api/payments/create-payment-intent.ts`
   - [x] `api/payments/receipt/[id].ts`
   - [x] `api/payments/receipt/generate.ts`

### Phase 3: Frontend Cleanup (COMPLETED)
1. Removed Old Services:
   - [x] `src/services/paymentService.ts`
   - [x] `src/services/stripe.ts`

### Remaining Tasks:
1. Create new PaymentStep for Stripe Checkout
2. Create success/cancel pages
3. Test the new implementation end-to-end

### Verification Steps:
1. Run the application and verify no broken imports
2. Test the new payment flow end-to-end
3. Verify all payment-related features still work:
   - Booking creation
   - Payment processing
   - Receipt viewing
   - Webhook handling

### Phase 4: Testing & Verification

1. Test Coverage
```bash
# Run all tests to ensure nothing broke
npm run test

# Run specific integration tests
npm run test:integration -- --grep "payment"
```

2. Manual Testing Checklist
- [ ] Complete new booking flow
- [ ] Verify Stripe Checkout redirect
- [ ] Test webhook handling
- [ ] Verify success/cancel flows
- [ ] Check payment status updates

### Phase 5: Documentation Update

1. Remove Old Documentation
- Remove Stripe Elements integration docs
- Remove custom payment form docs
- Remove receipt handling docs

2. Update API Documentation
- Remove old payment endpoints
- Update webhook documentation
- Add Checkout integration docs

## Rollback Plan

### If Issues Occur
1. Restore from Git
```bash
git checkout <last-working-commit>
```

2. Database Rollback
```sql
-- Restore any dropped tables if needed
CREATE TABLE IF NOT EXISTS payment_receipts ...
CREATE TABLE IF NOT EXISTS payment_refunds ...
```

3. Package Restoration
```bash
npm install @stripe/react-stripe-js@<version>
```

## Success Criteria

### 1. Code Cleanup
- [ ] All old files removed
- [ ] No unused dependencies
- [ ] Clean git history
- [ ] Updated documentation

### 2. Functionality
- [ ] New payment flow works
- [ ] No broken references
- [ ] All tests passing
- [ ] No deployment issues

### 3. Performance
- [ ] No memory leaks
- [ ] Reduced bundle size
- [ ] Faster loading times
- [ ] Clean error logs

## Notes
- Take iterative approach to removal
- Test thoroughly between steps
- Keep deployment backup ready
- Document all removed code
- Update team on changes 