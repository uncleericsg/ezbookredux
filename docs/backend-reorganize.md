# Backend Reorganization Plan for Vercel Deployment
Created: January 14, 2025, 4:19 AM (UTC+8)
Last Updated: January 14, 2025, 4:21 AM (UTC+8)

## 1. Current Structure Analysis

### 1.1 Backend Files Location
- `/src/server.ts` - Express server setup
- `/src/api/stripe.ts` - Stripe payment routes
- `/src/server/routes/payments.ts` - Payment receipt routes
- `/src/lib/supabase.server.ts` - Supabase server configuration

### 1.2 Affected Frontend Files
Components:
- `/src/components/booking/BookingConfirmation.tsx`
- `/src/components/booking/PaymentStep.tsx`

Hooks and Services:
- `/src/hooks/usePayment.ts`
- `/src/services/stripe.ts`
- `/src/services/paymentService.ts`

Configuration:
- `/src/lib/trpc.ts`
- `/src/hooks/useSettingsSections.ts`

## 2. New Structure Design

```
/
├── api/                              # Vercel API routes
│   ├── health.ts                     # Health check endpoint
│   └── payments/
│       ├── create-payment-intent.ts  # Payment creation endpoint
│       ├── webhook.ts               # Stripe webhook handler
│       └── receipt/
│           ├── [id].ts              # Get receipt by ID
│           └── generate.ts          # Generate PDF receipt
│
├── server/                           # Backend business logic
│   ├── config/
│   │   ├── cors.ts                  # CORS configuration
│   │   └── database.ts              # Supabase configuration
│   │
│   ├── services/
│   │   └── stripe/
│   │       ├── paymentService.ts    # Payment business logic
│   │       └── receiptService.ts    # Receipt generation logic
│   │
│   └── utils/
│       ├── error-handler.ts         # Error handling middleware
│       └── logger.ts                # Logging utility
```

## 3. Migration Steps

### Phase 1: Setup (Estimated time: 30 minutes)
1. Create new directory structure
2. Set up TypeScript configurations for new paths
3. Update path aliases in tsconfig.json
4. Create placeholder files with basic exports

### Phase 2: Backend Migration (Estimated time: 2 hours)

#### 2.1 Server Configuration
1. Move CORS configuration from src/server.ts to server/config/cors.ts
2. Move Supabase configuration from src/lib/supabase.server.ts to server/config/database.ts
3. Create error handling utilities in server/utils/error-handler.ts

#### 2.2 Payment Services
1. Extract payment logic from src/api/stripe.ts to server/services/stripe/paymentService.ts
2. Extract receipt logic from src/server/routes/payments.ts to server/services/stripe/receiptService.ts
3. Create new Vercel API routes in api/payments/

### Phase 3: Frontend Updates (Estimated time: 1 hour)

#### 3.1 Update Import Paths
```typescript
// Before
import { createPaymentIntent } from '@services/stripe'
// After
import { createPaymentIntent } from '@/server/services/stripe/paymentService'
```

#### 3.2 Update API Endpoints
```typescript
// Before
fetch('/api/payments/${id}/generate-receipt')
// After
fetch('/api/payments/receipt/generate/${id}')
```

### Phase 4: Testing (Estimated time: 1.5 hours)
1. Test all payment flows
2. Test receipt generation
3. Test webhook handling
4. Verify frontend functionality
5. Check error handling

## 4. Verification Checklist

### 4.1 Backend Verification
- [ ] All API routes respond correctly
- [ ] Payment processing works
- [ ] Receipt generation works
- [ ] Webhook handling works
- [ ] Error handling is consistent
- [ ] CORS is properly configured
- [ ] Database connections work

### 4.2 Frontend Verification
- [ ] All imports are updated
- [ ] API calls work
- [ ] Payment flow works
- [ ] Receipt download works
- [ ] Error handling works
- [ ] No console errors

## 5. Rollback Plan

### 5.1 Preparation
1. Create backup branch of current state
2. Document all current API endpoints
3. Keep old files until verification complete

### 5.2 Rollback Steps
1. Revert to backup branch
2. Restore original file structure
3. Verify original functionality

## 6. Post-Migration Tasks

### 6.1 Cleanup
- [ ] Remove old files
- [ ] Update documentation
- [ ] Remove unused dependencies
- [ ] Update API documentation

### 6.2 Monitoring
- [ ] Set up error tracking
- [ ] Monitor API performance
- [ ] Check error logs
- [ ] Verify webhook reliability

## 7. Dependencies and Environment Variables

### 7.1 Required Dependencies
```json
{
  "@vercel/node": "latest",
  "stripe": "^2023.10.16",
  "pdfkit": "latest"
}
```

### 7.2 Environment Variables
```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 8. Notes and Considerations

### 8.1 Performance Considerations
- Vercel cold starts
- API route optimization
- Database connection pooling
- File size optimization

### 8.2 Security Considerations
- API route protection
- Environment variable handling
- CORS configuration
- Rate limiting

### 8.3 Maintenance Considerations
- Logging strategy
- Error tracking
- Performance monitoring
- Backup strategy

## 9. Timeline

Total Estimated Time: 5 hours

1. Setup: 30 minutes
2. Backend Migration: 2 hours
3. Frontend Updates: 1 hour
4. Testing: 1.5 hours

## 10. Support and Resources

### 10.1 Documentation
- Vercel API Routes: https://vercel.com/docs/serverless-functions/introduction
- Stripe API: https://stripe.com/docs/api
- Supabase: https://supabase.com/docs

### 10.2 Testing Resources
- API Testing: Postman/Thunder Client
- Frontend Testing: Chrome DevTools
- Payment Testing: Stripe Test Cards