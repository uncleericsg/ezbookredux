# Supabase Migration Plan

## Overview
This document outlines the plan to centralize Supabase configuration and standardize its usage across the project.

## 1. Current Structure ✅
```
server/
└── config/
    └── supabase/
        ├── client.ts      # Centralized Supabase client initialization
        ├── types.ts       # Database and API types
        └── constants.ts   # Supabase-related constants
└── middleware/
    └── supabase.ts       # Authentication middleware
```

## 2. Files Updated

### Frontend Services (`src/services/`) ✅
- [x] notifications.ts - Using `supabaseClient`
- [x] setupCustomersTable.ts - Using `supabaseAdmin`
- [x] serviceService.ts - Using `supabaseClient`
- [x] reviewService.ts - Using `supabaseClient`
- [x] profileService.ts - Using `supabaseClient`
- [x] paymentService.ts - Using `supabaseClient` (with Stripe)
- [x] bookingService.ts - Using `supabaseClient`
- [x] addressService.ts - Using `supabaseClient`
- [x] timeSlotService.ts - Updated to use `supabaseClient`
- [x] supabaseBookingService.ts - Updated to use `supabaseClient`
- [x] serviceUtils.ts - Updated to use `supabaseClient`
- [x] checkUserBookingLink.ts - Updated to use `supabaseClient`
- [x] checkSchema.ts - Updated to use `supabaseClient`
- [x] checkAddressTable.ts - Updated to use `supabaseClient`
- [x] checkBookingTable.ts - Updated to use `supabaseClient`

### API Routes (`src/pages/api/`) ✅
- [x] bookings/[id].ts - Updated with shared middleware and booking service
- [x] bookings/create.ts - Updated with shared middleware and booking service
- [x] bookings/email/[email].ts - Updated with shared middleware and listBookings service
- [x] bookings/customer/[customerId].ts - Updated with shared middleware and listBookings service
- [x] payments/webhook.ts - Already using centralized Stripe service and proper error handling
- [x] geocode.ts - Updated with shared middleware and standardized error handling
- [x] health.ts - Updated with standardized error handling and response format

### Configuration Files ✅
- [x] Remove src/lib/supabase.server.ts
- [x] Remove src/lib/supabase.ts
- [x] Remove src/config/supabase.ts
- [x] Remove server/config/database.ts

### Components ✅
- [x] src/components/test/SupabaseTest.tsx - Updated to use `supabaseClient`
- [x] src/components/booking/old_CustomerForm.tsx - Updated to use `supabaseClient`

### Other Files ✅
- [x] src/lib/test-db.ts - Updated to use `supabaseClient`
- [x] server/repositories/paymentRepository.ts - Updated to use `supabaseClient`

### Middleware ✅
- [x] Update api/shared/middleware.ts with withAuth middleware
- [x] Create api/shared/types.ts for shared types
- [x] Integrate new authentication middleware in booking routes

## 3. Migration Steps

### Phase 1: Setup ✅
- [x] Create centralized client configuration
- [x] Create constants file
- [x] Create authentication middleware
- [x] Document migration plan

### Phase 2: Service Updates ✅
- [x] Update all service files to use centralized clients
- [x] Remove individual Supabase client initialization
- [x] Standardize error handling
- [x] Maintain type safety with Database types

### Phase 3: API Route Updates ✅
- [x] Update booking routes with centralized configuration
- [x] Implement shared authentication middleware
- [x] Standardize error handling and response format
- [x] Update remaining API routes

### Phase 4: Cleanup ✅
1. [x] Remove deprecated Supabase configuration files
2. [x] Update import paths in all files
3. [ ] Remove unused environment variables
4. [ ] Update documentation

## 4. Type Safety Improvements ✅
- [x] Generated types from Supabase schema
- [x] Created shared AuthenticatedRequest type
- [x] Implemented proper error handling with ApiError class
- [x] Added type safety to all booking routes

## 5. Testing Plan 🚧
- [ ] Test authentication middleware
- [ ] Test booking service methods
- [ ] Test API routes with authentication
- [ ] Validate error scenarios

## 6. Rollback Plan ✅
- [x] Backup of configuration files created
- [x] Import paths documented
- [x] Environment variables saved

## 7. Post-Migration Tasks 🚧
- [ ] Update API documentation
- [ ] Document new authentication flow
- [ ] Set up error tracking
- [ ] Monitor authentication failures

## 8. Timeline

1. **Phase 1 (Setup)**: ✅ Completed
2. **Phase 2 (Services)**: ✅ Completed
3. **Phase 3 (API Routes)**: ✅ Completed
4. **Phase 4 (Cleanup)**: ✅ Completed
5. **Testing**: 🚧 In Progress
6. **Documentation**: 🚧 Pending

Estimated time remaining: 1-2 days

## 9. Success Criteria
- [x] All services using centralized configuration
- [x] No direct Supabase client creation in services
- [x] All API routes properly authenticated
- [x] Type safety improvements implemented
- [x] All API routes updated
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No production errors related to Supabase

## Next Steps

1. Begin Testing Phase
   - Set up test environment
   - Write unit tests for booking service
   - Test authentication middleware

2. Start Documentation Updates
   - Document new authentication flow
   - Update API documentation
   - Create monitoring plan

3. Environment Variable Cleanup
   - Audit environment variables
   - Remove unused variables
   - Update environment documentation 