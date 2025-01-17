# Backend Reorganization Roadmap
Last Updated: January 17, 2024

## Current Status Analysis

### Completed (✅)
- Basic API routes structure
- Core endpoints implementation
- Error handling utilities
- Type definitions
- Logger implementation
- Basic middleware layer
- Supabase configuration centralization
- Payment provider interface design
- Stripe Checkout integration

### In Progress (🚧)
- Service layer consolidation
- API standardization
- Database layer finalization
- Testing infrastructure
- Payment session tracking

### Issues Identified
1. Service Layer Duplication
   - Legacy payment services need cleanup
   - Mixed service responsibilities
   - Inconsistent provider patterns

2. Directory Structure Inconsistencies
   - Provider-specific code not properly isolated
   - Unclear service boundaries
   - Inconsistent naming patterns

## Phase 1: Service Layer Reorganization (Priority: HIGHEST)
Status: 🚧 In Progress

### 1.1 Payment Service Architecture (Current Focus)
```typescript
server/services/
├── payments/
│   ├── providers/
│   │   └── stripe/
│   │       └── StripeCheckoutProvider.ts
│   └── PaymentService.ts
└── repositories/
    └── payments/
        └── PaymentSessionRepository.ts
```

Tasks:
- [x] Design payment provider interfaces
- [x] Implement Stripe Checkout provider
- [x] Create payment session repository
- [ ] Add database migrations
- [ ] Implement success/cancel pages

### 1.2 Implementation Cleanup
- [ ] Remove legacy Stripe implementation
- [ ] Clean up unused receipt services
- [ ] Update service dependencies
- [ ] Remove duplicate code

### 1.3 Repository Layer
- [x] Implement PaymentRepository
- [ ] Add database transaction support
- [ ] Create repository interfaces
- [ ] Add data validation

## Phase 2: API Standardization (Priority: HIGH)
Status: 📅 Pending

### 2.1 Response Format
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: ResponseMetadata;
}
```

Tasks:
- [ ] Create response wrapper
- [ ] Standardize error formats
- [ ] Add response metadata
- [ ] Implement pagination

### 2.2 Middleware Enhancement
- [ ] Update authentication middleware
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Add request logging

### 2.3 API Routes Reorganization
```typescript
api/
├── payments/
│   ├── checkout.ts
│   └── webhook.ts
└── shared/
    └── middleware/
```

## Phase 3: Testing Infrastructure (Priority: HIGH)
Status: 📅 Pending

### 3.1 Unit Testing
- [ ] Set up testing framework
- [ ] Create service test suites
- [ ] Add repository tests
- [ ] Implement provider tests

### 3.2 Integration Testing
- [ ] Set up test database
- [ ] Create API test suites
- [ ] Add webhook test cases
- [ ] Test error scenarios

### 3.3 Test Utilities
- [ ] Create test factories
- [ ] Add mock providers
- [ ] Create test helpers
- [ ] Set up test data seeding

## Implementation Plan

### Week 1: Payment Service (Current)
```markdown
Days 1-2: ✅ Payment Architecture
- Created interfaces
- Implemented Stripe Checkout
- Set up repositories

Days 3-4: 🚧 Implementation
- Database migrations
- Success/cancel pages
- Clean up legacy code

Day 5: 📅 Testing
- Unit tests
- Integration tests
- Webhook testing
```

### Week 2: API & Testing
```markdown
Days 1-2: API Standardization
- Update response formats
- Enhance middleware
- Reorganize routes

Days 3-5: Testing Infrastructure
- Set up framework
- Create test suites
- Add integration tests
```

## Success Criteria

### 1. Code Organization
- [x] Clear service boundaries
- [x] No code duplication
- [x] Consistent patterns
- [x] Type safety

### 2. Payment Processing
- [x] Simplified payment flow
- [x] Secure payment handling
- [x] Proper error handling
- [ ] Complete testing coverage

### 3. API Quality
- [ ] Standardized responses
- [x] Proper error handling
- [ ] Request validation
- [ ] Documentation

## Next Immediate Steps

1. Database Setup
   ```sql
   -- Create payment_sessions table
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
   ```

2. Frontend Integration
   ```typescript
   // Create success/cancel pages
   // Implement payment initiation
   // Add loading states
   ```

3. Testing Setup
   - Choose testing framework
   - Create initial test suites
   - Set up test database

## Notes
- Simplified payment approach chosen for better maintainability
- Focus on completing payment integration before other features
- Document all architectural decisions
- Keep comprehensive test coverage