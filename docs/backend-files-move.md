# Backend Files Migration Plan

## 1. Objectives
- Reorganize backend files into a clear, maintainable structure
- Improve code organization and separation of concerns
- Prepare for Vercel deployment
- Ensure minimal disruption to existing functionality

## 2. Prerequisites
- [ ] Verify all tests are passing
- [ ] Create backup branch
- [ ] Update development environment configuration
- [ ] Review current API documentation

## 3. Risk Assessment

### Potential Risks
- Broken imports and references
- API endpoint changes affecting frontend
- Configuration file conflicts
- Testing coverage gaps

### Mitigation Strategies
- Comprehensive test suite
- Automated import path updates
- API versioning
- Staged rollout plan

## 4. Migration Phases

### Phase 1: Payment Services Migration (Priority: High)
1. Move Payment-Related Files:
   - [x] `src/services/stripe.ts` → `server/services/stripe/paymentService.ts`
   - [x] `src/services/paymentService.ts` → `server/services/payments/paymentService.ts`
   - [x] Create API routes:
     - [x] `api/payments/create-payment-intent.ts`
     - [x] `api/payments/webhook.ts`
     - [x] `api/payments/receipt/[id].ts`
     - [x] `api/payments/receipt/generate.ts`
   - [x] Update import paths in:
     - [x] `src/components/booking/PaymentStep.tsx`
     - [x] `src/components/booking/BookingConfirmation.tsx`
     - [x] `src/hooks/usePayment.ts`

2. Update TypeScript Configuration:
   - [x] Add server paths to tsconfig.json
   - [x] Add shared types directory
   - [x] Update path aliases
   - [x] Configure server-specific settings

3. Shared Types Setup:
   - [x] Create shared/types directory
   - [x] Move common types to shared location
   - [x] Update imports to use shared types

Next Steps:
1. [x] Test the payment flow end-to-end
2. [x] Proceed with Phase 2 (Booking Services Migration)

### Phase 2: Booking Services Migration (Priority: High)
1. Move Booking-Related Files:
   - [x] `src/services/supabaseBookingService.ts` → `server/services/bookings/bookingService.ts`
   - [x] Create API routes:
     - [x] `api/bookings/create.ts`
     - [x] `api/bookings/[id].ts`
     - [x] `api/bookings/customer/[customerId].ts`
     - [x] `api/bookings/email/[email].ts`
   - [x] Create shared booking types
   - [x] Update frontend booking service
   - [x] Update dependent components and hooks:
     - [x] `src/components/booking/BookingStep.tsx`
     - [x] `src/components/booking/BookingList.tsx`
     - [x] `src/hooks/useBooking.ts`

2. Update Service Dependencies:
   - [x] Review and update service connections
   - [x] Verify database interactions
   - [x] Test booking flow end-to-end

Next Steps:
1. [x] Update dependent components to use new booking service
2. [x] Create booking API routes
3. [x] Test booking flow end-to-end

### Phase 3: Server Configuration Migration (Priority: Medium)
1. Move Configuration Files:
   - [x] Create `server/config/` directory
   - [x] Move CORS configuration to `server/config/cors.ts`
   - [x] Move database configuration to `server/config/database.ts`
   - [x] Create error handling utilities in `server/utils/error-handler.ts`

2. Create API Routes:
   - [x] `api/health.ts` for health check endpoint
   - [x] `api/geocode.ts` for location services

3. Verify Configuration:
   - [x] Test CORS settings
   - [x] Verify database connections
   - [x] Test error handling
   - [x] Update API documentation

### Phase 4: Testing and Validation (Priority: High)
1. Unit Tests:
   - [ ] Create/update tests for migrated services
   - [ ] Verify service interactions
   - [ ] Test error handling

2. Integration Tests:
   - [ ] Test payment flow
   - [ ] Test booking flow
   - [ ] Verify API endpoints

3. End-to-End Tests:
   - [ ] Complete booking process
   - [ ] Payment processing
   - [ ] Error scenarios

## 5. Validation Checklist

### 5.1 Backend Verification
- [x] All API routes respond correctly
- [x] Payment processing works
- [x] Booking flow works
- [x] Error handling is consistent
- [x] Database connections work

### 5.2 Frontend Verification
- [x] All imports are updated
- [x] API calls work
- [x] Payment flow works
- [x] Booking flow works
- [x] No console errors

## 6. Rollback Plan

### 6.1 Preparation
1. Create backup branch of current state
2. Document all current API endpoints
3. Keep old files until verification complete

### 6.2 Rollback Steps
1. Revert to backup branch
2. Restore original file structure
3. Verify original functionality

## 7. Post-Migration Tasks

### 7.1 Cleanup
- [x] Remove old files after successful migration
- [x] Update documentation
- [x] Remove unused dependencies
- [x] Update API documentation

### 7.2 Monitoring
- [x] Set up error tracking
- [x] Monitor API performance
- [x] Check error logs
- [x] Verify webhook reliability

## 8. Dependencies and Environment Variables

### 8.1 Required Dependencies
```json
{
  "@vercel/node": "latest",
  "stripe": "^2023.10.16",
  "@supabase/supabase-js": "latest"
}
```

### 8.2 Environment Variables
```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 9. Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Payment Services | 1 day | TypeScript config |
| Booking Services | 1 day | Payment services |
| Server Configuration | 0.5 day | Payment services |
| Testing | 1.5 days | All migrations |

Total Estimated Time: 4 days

## 10. Next Steps

1. Create backup branch:
   ```bash
   git checkout -b backend-reorganization-$(date +%Y%m%d)
   ```

2. Update TypeScript configuration
3. Begin with Payment Services migration
4. Run tests after each phase
5. Document any issues or blockers

## 11. Support and Resources

### Documentation
- Vercel API Routes: https://vercel.com/docs/serverless-functions/introduction
- Stripe API: https://stripe.com/docs/api
- Supabase: https://supabase.com/docs

### Testing Resources
- API Testing: Postman/Thunder Client
- Frontend Testing: Chrome DevTools
- Payment Testing: Stripe Test Cards