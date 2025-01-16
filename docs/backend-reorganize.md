# Backend Reorganization Plan for Vercel Deployment
Created: January 14, 2025, 4:19 AM (UTC+8)
Last Updated: January 17, 2025, 4:42 AM (UTC+8)

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
│   ├── geocode.ts                    # Geocoding service endpoint
│   ├── bookings/                     # Booking-related endpoints
│   │   ├── create.ts                 # Create booking
│   │   ├── [id].ts                  # Get/Update booking
│   │   ├── customer/[customerId].ts  # Customer bookings
│   │   └── email/[email].ts         # Email-based bookings
│   └── payments/                     # Payment-related endpoints
│       ├── create-payment-intent.ts  # Payment creation endpoint
│       ├── webhook.ts               # Stripe webhook handler
│       └── receipt/                 # Receipt endpoints
│           ├── [id].ts             # Get receipt by ID
│           └── generate.ts         # Generate receipt URL
│
├── server/                           # Backend business logic
│   ├── config/                       # Configuration files
│   │   ├── cors.ts                  # CORS configuration
│   │   └── database.ts              # Database configuration
│   │
│   ├── services/                     # Business logic services
│   │   ├── bookings/                # Booking-related services
│   │   │   └── bookingService.ts    # Booking operations
│   │   └── payments/                # Payment processing
│   │       ├── paymentService.ts    # Main payment orchestrator
│   │       └── stripe/              # Stripe provider integration
│   │           ├── stripeService.ts # Core Stripe functionality
│   │           └── receiptService.ts# Receipt generation
│   │
│   ├── middleware/                   # Request handling middleware
│   │   ├── validation/              # Request validation
│   │   ├── auth/                    # Authentication middleware
│   │   └── errorHandling.ts         # Error handling middleware
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── booking.ts              # Booking-related types
│   │   ├── payment.ts              # Payment-related types
│   │   └── common.ts               # Shared type definitions
│   │
│   ├── repositories/                # Database access layer
│   │   ├── bookingRepository.ts    # Booking data operations
│   │   └── paymentRepository.ts    # Payment data operations
│   │
│   ├── migrations/                  # Database migrations
│   │   ├── booking/                # Booking table migrations
│   │   └── payment/                # Payment table migrations
│   │
│   └── utils/                       # Utility functions
│       ├── error-handler.ts         # Error handling utilities
│       ├── logger.ts                # Logging utilities
│       └── apiErrors.ts             # API error definitions
```

## 3. Migration Steps

### Phase 1: Setup (Estimated time: 30 minutes)
1. Create new directory structure
2. Set up TypeScript configurations for new paths
3. Update path aliases in tsconfig.json
4. Create placeholder files with basic exports

### Phase 2: Backend Migration (Estimated time: 2 hours)

#### 2.1 Payment Services Organization
1. Create main payment service as orchestrator
   - Handle all payment-related operations
   - Delegate provider-specific operations
   - Manage payment lifecycle

2. Implement payment provider (Stripe)
   - Core payment functionality
   - Webhook handling
   - Receipt generation

3. Service Responsibilities
   - `paymentService.ts`: High-level payment operations
   - `stripe/stripeService.ts`: Stripe-specific operations
   - `stripe/receiptService.ts`: Receipt handling

4. Error Handling
   - Consistent error types
   - Proper error propagation
   - Detailed logging

#### 2.2 Middleware Setup
1. Create validation middleware for request validation
2. Set up authentication middleware
3. Implement error handling middleware
4. Configure request logging

#### 2.3 Repository Layer
1. Create booking repository for database operations
2. Create payment repository for transaction handling
3. Implement data access patterns and caching

#### 2.4 Type Definitions
1. Define shared types for backend and frontend
2. Create booking-related type definitions
3. Create payment-related type definitions
4. Set up common utility types

#### 2.5 Database Migrations
1. Set up migration framework
2. Create booking table migrations
3. Create payment table migrations
4. Implement migration rollback plans

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
  "@supabase/supabase-js": "latest",
  "zod": "latest",           // For request validation
  "winston": "latest",       // For logging
  "kysely": "latest"         // For type-safe migrations
}
```

### 7.2 Environment Variables
```

## 9. Prioritized Action Plan - January 17, 2025, 4:44 AM (UTC+8)

### 9.1 Immediate Priorities (Next 48 hours)
1. **Critical Infrastructure Setup**
   - Create server/services directory with core services
   - Implement repository layer pattern
   - Set up type definitions for core entities

2. **Payment System Completion**
   - Finalize Stripe integration
   - Complete webhook handling
   - Implement receipt generation service

3. **Error Handling Standardization**
   - Create unified error handling middleware
   - Implement consistent error responses
   - Set up error logging infrastructure

### 9.2 Short-Term Goals (Next 7 days)
1. **Service Layer Implementation**
   - Migrate booking business logic
   - Implement payment service orchestration
   - Create shared utility functions

2. **Frontend Integration**
   - Update all payment-related imports
   - Migrate booking service imports
   - Verify API endpoint compatibility

3. **Testing Infrastructure**
   - Set up integration test framework
   - Create test cases for core services
   - Implement automated API testing

### 9.3 Strategic Decisions
1. **Technology Stack**
   - Maintain current stack (Vercel, Supabase, Stripe)
   - Evaluate need for additional monitoring tools
   - Consider implementing distributed tracing

2. **Team Allocation**
   - Dedicate 2 developers to service layer
   - Assign 1 developer to frontend integration
   - Have 1 developer focus on testing

3. **Risk Mitigation**
   - Maintain rollback capability
   - Implement feature flags for new services
   - Set up staging environment for testing

### 9.4 Key Performance Indicators
- API response time < 200ms
- Error rate < 0.1%
- Test coverage > 80%
- Deployment frequency: 2x daily
- Mean time to recovery < 30 minutes

### 9.5 Communication Plan
- Daily standups for progress tracking
- Weekly architecture review meetings
- Documentation updates after each milestone
- Automated status reports to stakeholders

## 8. Current Status - January 17, 2025, 4:42 AM (UTC+8)

### 8.1 Completion Status
- API Routes: 90% complete
  - ✅ Core endpoints implemented
  - ✅ Payment endpoints functional
  - ✅ Shared middleware in place
  - ⚠️ Some booking endpoints need testing

- Server Structure: 40% complete
  - ✅ Supabase configuration migrated
  - ✅ Basic routes in place
  - ❌ Missing services directory
  - ❌ Missing repositories layer
  - ❌ Missing type definitions
  - ❌ Incomplete utility functions

- Frontend Integration: 60% complete
  - ✅ Supabase imports updated
  - ⚠️ Some payment service imports need updating
  - ❌ Booking service imports need migration

### 8.2 Remaining Tasks
1. Complete server directory structure
2. Migrate remaining business logic
3. Update frontend imports
4. Implement comprehensive testing
5. Finalize documentation

### 8.3 Observations
- API endpoints are well organized and follow the planned structure
- Server-side business logic needs consolidation
- Type safety needs improvement with proper type definitions
- Repository pattern implementation is pending
- Error handling needs standardization across services

### 8.4 Next Steps
1. Create missing server directories
2. Migrate remaining services
3. Implement repository layer
4. Update frontend imports
5. Conduct integration testing