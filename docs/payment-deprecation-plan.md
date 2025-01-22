# Payment System Deprecation Plan

## Overview
This document outlines the strategy for deprecating the current payment implementation in favor of Stripe Checkout as documented in Stripe-Simplified.md.

## Files to Deprecate

### API Routes
- [ ] `api/payments/stripe.ts` -> Replace with `server/api/payments/checkout.ts`
- [ ] `api/payments/webhook.ts` -> Replace with new webhook handler

### Services
- [ ] `services/payments/PaymentService.ts` -> Replace with StripeCheckoutProvider
- [ ] `services/payments/providers/*` -> Consolidate into single Stripe provider
- [ ] `services/repositories/payments/*` -> Migrate to new schema

### Components
- [ ] `components/payment/PaymentForm.tsx` -> Replace with redirect to Stripe Checkout
- [ ] `components/payment/PaymentSummary.tsx` -> Update to use new payment flow
- [ ] `components/payment/PaymentErrorBoundary.tsx` -> Simplify error handling
- [ ] `components/payment/TermsAndConditions.tsx` -> Move to Stripe Checkout UI

## Deprecation Steps

1. **Phase 1: Setup New Implementation**
   - [x] Create new payment session schema
   - [ ] Implement Stripe Checkout provider
   - [ ] Set up webhook handling
   - [ ] Create success/cancel pages

2. **Phase 2: Dual Running Period**
   - [ ] Add deprecation notices to old payment components
   - [ ] Log usage of deprecated payment endpoints
   - [ ] Implement feature flag for new payment flow
   - [ ] Test both implementations in parallel

3. **Phase 3: Migration**
   - [ ] Migrate existing bookings to new payment schema
   - [ ] Update booking creation flow
   - [ ] Update admin payment views
   - [ ] Update payment reporting

4. **Phase 4: Cleanup**
   - [ ] Remove deprecated payment components
   - [ ] Remove old payment routes
   - [ ] Remove unused payment services
   - [ ] Clean up old payment types

## Database Changes
- [ ] Create new payment_sessions table
- [ ] Migrate existing payment data
- [ ] Update payment-related indexes
- [ ] Remove deprecated payment tables

## Type Updates
- [ ] Create new payment session types
- [ ] Update booking types to reference new payment schema
- [ ] Remove deprecated payment types
- [ ] Update API response types

## Testing Strategy
1. **Integration Tests**
   - [ ] Add tests for Stripe Checkout flow
   - [ ] Add webhook handling tests
   - [ ] Test success/cancel scenarios
   - [ ] Test error handling

2. **Migration Tests**
   - [ ] Test data migration scripts
   - [ ] Verify payment history preservation
   - [ ] Test booking status updates

## Rollback Plan
1. Keep old implementation files until full migration
2. Maintain feature flag for quick rollback
3. Keep database backups before migrations
4. Document rollback procedures

## Timeline
1. Phase 1: 1 week
2. Phase 2: 2 weeks
3. Phase 3: 1 week
4. Phase 4: 1 week

## Monitoring
- [ ] Add logging for deprecated route usage
- [ ] Monitor payment success rates
- [ ] Track migration progress
- [ ] Monitor error rates

## Communication Plan
1. Notify admin users of upcoming changes
2. Document new payment flow for support team
3. Update API documentation
4. Prepare customer communications

## Success Criteria
1. All payments processed through Stripe Checkout
2. Zero usage of deprecated payment routes
3. All payment data migrated to new schema
4. No increase in payment failures
5. Successful webhook processing

## Notes
- Keep feature flags until confident in new implementation
- Maintain backward compatibility during migration
- Document all breaking changes
- Keep detailed migration logs