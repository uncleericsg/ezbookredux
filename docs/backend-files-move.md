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
   - [ ] `src/services/stripe.ts` → `server/services/stripe/stripeService.ts`
   - [ ] `src/services/paymentService.ts` → `server/services/payments/paymentService.ts`
   - [ ] Update import paths in:
     - [ ] `src/components/booking/PaymentStep.tsx`
     - [ ] `src/components/booking/BookingConfirmation.tsx`
     - [ ] `src/hooks/usePayment.ts`

2. Update TypeScript Configuration:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@server/*": ["./server/*"],
         "@services/*": ["./src/services/*"]
       }
     }
   }
   ```

### Phase 2: Booking Services Migration (Priority: High)
1. Move Booking-Related Files:
   - [ ] `src/services/supabaseBookingService.ts` → `server/services/bookings/bookingService.ts`
   - [ ] Update dependent components and hooks
   - [ ] Migrate related types and interfaces

2. Update Service Dependencies:
   - [ ] Review and update service connections
   - [ ] Verify database interactions
   - [ ] Test booking flow end-to-end

### Phase 3: Route Migration (Priority: Medium)
1. Move API Routes:
   - [ ] Identify routes in `src/server/routes/`
   - [ ] Migrate to `server/routes/` maintaining structure
   - [ ] Update API endpoint references

2. Verify Route Functionality:
   - [ ] Test all migrated endpoints
   - [ ] Verify request/response handling
   - [ ] Update API documentation

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
- [ ] All API routes respond correctly
- [ ] Payment processing works
- [ ] Booking flow works
- [ ] Error handling is consistent
- [ ] Database connections work

### 5.2 Frontend Verification
- [ ] All imports are updated
- [ ] API calls work
- [ ] Payment flow works
- [ ] Booking flow works
- [ ] No console errors

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
- [ ] Remove old files after successful migration
- [ ] Update documentation
- [ ] Remove unused dependencies
- [ ] Update API documentation

### 7.2 Monitoring
- [ ] Set up error tracking
- [ ] Monitor API performance
- [ ] Check error logs
- [ ] Verify webhook reliability

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
| Route Migration | 0.5 day | Services migration |
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