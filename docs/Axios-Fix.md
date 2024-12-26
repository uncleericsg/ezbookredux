# Axios Integration Fix for Stripe Payments

## Overview
This document outlines the implementation and fixes for Axios integration with Stripe payments in the iAircon Easy Booking platform.

## Current Issues (2024-12-27)
1. Service Lookup Error:
   - Error: `PGRST116 - The result contains 0 rows`
   - Root cause: Mismatch between code and database schema
   - Location: `serviceUtils.ts` and `PaymentStep.tsx`

2. Schema Misalignment:
   - Code expects `appointment_type_id` column in services table
   - Actual schema only has `id`, `title`, `description`, `price`, `duration`
   - Causing service lookup failures

3. Component Issues:
   - Unnecessary service lookup when data already available
   - Missing validation for service IDs
   - Insufficient error handling for lookup failures

## Implemented Fixes

### 1. Server URL Configuration
- Updated `.env`:
  ```env
  VITE_API_URL=http://localhost:3001
  ```
- Modified fallback URL in `paymentService.ts` to use localhost

### 2. Axios Configuration
- Increased timeout from 10s to 30s
- Added retry mechanism with exponential backoff:
  ```typescript
  const maxRetries = 3;
  const retryDelay = 1000; // Start with 1 second
  // Exponential backoff: 1s, 2s, 4s
  ```

### 3. Error Handling
- Implemented retry logic for network failures
- Added detailed error logging
- Improved error messages for debugging

### 4. Component Fixes
- Added missing import in PaymentStep.tsx:
  ```typescript
  import { cn } from '@utils/cn';
  ```
- Fixed class name merging for payment UI elements
- Fixed service lookup to use correct ID:
  ```typescript
  // Before
  const serviceDetails = await getServiceByAppointmentType(bookingData.selectedService.id);
  // After
  const serviceDetails = await getServiceByAppointmentType(bookingData.selectedService.appointmentTypeId);
  ```

### 5. Service Validation Fix - 2024-12-27

#### Investigation Summary

##### Issue
Payment initialization failing with "Invalid service data" error in PaymentStep.

##### Root Cause Analysis
1. Examined service flow documentation:
   - `docs/archived/COMPLETED.service-pricing-flow.md`
   - `docs/archived/COMPLETED.payment-flow-analysis.md`
   - `docs/archived/COMPLETED.fixing-stripe-payment.md`

2. Found data structure mismatch:
   ```typescript
   // Frontend ServiceOption
   {
     id: 'powerjet-chemical-1unit',  // Maps to appointment_type_id
     title: 'POWERJET CHEMICAL WASH',
     price: 150,
     duration: '1 hour 30 minutes'
   }

   // Database Schema (from prisma/schema.prisma)
   model Service {
     id                  String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
     title               String
     description         String
     price               Int
     duration            String
     appointment_type_id String?   @unique @db.VarChar
     // ... other fields
   }
   ```

3. Validation Error:
   - Service validation was checking for `appointment_type_id` field
   - Frontend sends this as `id` in the ServiceOption
   - Simple field name mismatch causing validation failure

#### Solution
Simplified validation to match frontend data structure:
```typescript
export const isValidServiceData = (service: any): boolean => {
  if (!service) return false;
  
  // Frontend sends id which maps to appointment_type_id
  return (
    typeof service.id === 'string' &&
    typeof service.title === 'string' &&
    typeof service.price === 'number' &&
    typeof service.duration === 'string'
  );
};
```

#### Key Decisions
1. Focused on essential fields only:
   - id (maps to appointment_type_id)
   - title
   - price
   - duration

2. Avoided over-engineering:
   - No need to validate optional fields
   - Database schema validation happens at Supabase level
   - Keep validation focused on payment requirements

#### Files Modified
1. `/src/utils/validation.ts`
   - Updated isValidServiceData function
   - Simplified validation logic
   - Removed unnecessary field checks

#### Next Steps
1. Test payment flow with updated validation
2. Monitor for any validation errors
3. Ensure proper error logging is maintained

#### Lessons Learned
1. Always check actual data flow in documentation
2. Keep validation focused on immediate requirements
3. Avoid over-engineering simple fixes

## PaymentStep.tsx Fix Analysis - Multiple Attempts

## Original Requirements
1. Add ref to top booking summary
2. Remove duplicate summary
3. Add back button
4. Maintain consistent widths

## Layout Analysis (Final)

### Working Layout (PaymentStep.Full.UI.Working.tsx)
```tsx
<motion.div className="w-full max-w-4xl mx-auto py-1 px-0.5 sm:py-8 sm:px-4">
  {/* Booking Summary */}
  <div className="mb-2 sm:mb-8">
    <BookingSummary />
  </div>

  <div className="w-full max-w-4xl mx-auto">
    <Elements>
      {/* Content */}
    </Elements>
  </div>
</motion.div>
```

### Current Issues in PaymentStep.tsx
1. Over-styled Booking Summary
   - Added unnecessary styles that should be in BookingSummary component
   - Added `rounded-lg bg-card p-6 shadow-sm` incorrectly
   - Should only have margin styles `mb-2 sm:mb-8`

2. Elements Wrapper Missing Width
   - Missing `w-full max-w-4xl mx-auto` on Elements wrapper
   - Causing inconsistent widths between sections

### Correct Layout Structure
1. Top Container:
   - `w-full max-w-4xl mx-auto py-1 px-0.5 sm:py-8 sm:px-4`
   - Controls overall page width and padding

2. Booking Summary Container:
   - Only needs `mb-2 sm:mb-8`
   - Let BookingSummary component handle its own styling

3. Elements Wrapper:
   - Must have `w-full max-w-4xl mx-auto`
   - Ensures consistent width with top container

## Fix Plan
1. Remove extra styles from Booking Summary div
2. Add proper width classes to Elements wrapper
3. Verify all sections align properly

## Previous Failed Attempts Summary
1. Added unnecessary heading
2. Removed critical dispatch
3. Changed container widths incorrectly
4. Added nested containers unnecessarily
5. Over-complicated simple layout structure

## Lessons Learned
1. Always compare with working reference file first
2. Don't add styles that belong in child components
3. Maintain consistent width patterns
4. Make minimal necessary changes
5. Follow existing layout patterns exactly

## Implementation Plan

### 1. Service Data Handling
- Use service details directly from bookingData
- Remove redundant service lookup
- Add validation for service data integrity

### 2. Database Schema Alignment
- Update service queries to match actual schema
- Modify service lookups to use correct fields
- Add proper type checking for database fields

### 3. Error Handling Enhancement
- Add comprehensive error logging
- Implement proper error recovery
- Improve user feedback for failures

### 4. Code Modifications
- Update PaymentStep.tsx to use direct service data
- Add UUID validation for service IDs
- Implement robust error handling
- No changes to UI/visual components

## Implementation Status
- [ ] Service data handling update
- [ ] Database schema alignment
- [ ] Error handling enhancement
- [ ] Code modifications
- [ ] Testing and validation

## Testing Status
- [x] Server URL configuration updated
- [x] Axios timeout increased
- [x] Retry mechanism implemented
- [x] Component errors fixed
- [ ] Service lookup fixed
- [ ] Payment flow testing

## Next Steps
1. Test service lookup with correct appointment type ID
2. Monitor retry mechanism effectiveness
3. Consider adding circuit breaker pattern for repeated failures
4. Update error messages for better user experience

## Notes
- Retry mechanism uses exponential backoff to prevent server overload
- Timeout increased to accommodate slower network conditions
- Local development now uses localhost for better reliability
- Service lookup now uses correct appointmentTypeId field

## Best Practices
1. Always use typed responses with TypeScript
2. Implement request interceptors for token handling
3. Set up response interceptors for error handling
4. Use environment variables for API endpoints

## Testing
- Implement unit tests for Axios requests
- Mock Axios responses in tests
- Test error scenarios and edge cases

## Related Files
- `/src/services/stripe.ts`
- `/src/api/payment.ts`
- `/src/utils/axios-config.ts`

Last Updated: 2024-12-27 03:09 SGT
