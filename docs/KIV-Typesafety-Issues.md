# Type Safety Issues Documentation

## Overview
This document outlines the current type safety issues in the iAircon EasyBooking project and provides a structured plan for improvements without affecting any visual or functional aspects of the application.

## Current Issues Analysis

### 1. Critical Areas (High Priority)

#### 1.1 Chart Data Types (`src/types/recharts.d.ts`)
```typescript
// Current Implementation
interface BaseChartProps {
  data?: any[];
}

// Recommended Improvement
interface BaseChartProps<T> {
  data?: T[];
}
```

#### 1.2 Settings Types (`src/types/settings.ts`)
- Issue: Overuse of optional properties
- Impact: Potential runtime errors from undefined checks
- Files Affected: AcuitySettings, ChatGPTSettings

### 2. Service and Booking Types

#### 2.1 Null vs Undefined Usage
Current pattern in `ServiceRequest` and related interfaces:
```typescript
interface ServiceRequest {
  notes?: string;
  specialInstructions?: string;
}
```

Should be explicitly typed as:
```typescript
interface ServiceRequest {
  notes: string | null;
  specialInstructions: string | null;
}
```

#### 2.2 Discriminated Unions
Areas needing improvement:
- Booking status types
- Payment status types
- Service request status types

## Implementation Plan

### Phase 1: Analysis and Documentation
- [x] Identify affected files
- [x] Document current type usage patterns
- [x] Create type safety improvement plan

### Phase 2: Core Type Definitions

#### 2.1 Status Types
```typescript
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';

export type ServiceRequestStatus = 
  | 'pending'
  | 'assigned'
  | 'in-progress'
  | 'completed';
```

#### 2.2 Base Types
```typescript
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseResponse<T> {
  data: T;
  error: string | null;
}
```

### Phase 3: Implementation Priority

1. **High Priority**
   - [ ] Service and booking core types
   - [ ] Payment processing types
   - [ ] User authentication types

2. **Medium Priority**
   - [ ] Admin dashboard types
   - [ ] Notification system types
   - [ ] Settings management types

3. **Low Priority**
   - [ ] Analytics and reporting types
   - [ ] UI utility types
   - [ ] Helper function types

## Files Requiring Updates

### Critical Path (High Priority)
1. `/src/types/booking.ts`
2. `/src/types/service.ts`
3. `/src/types/payment.ts`
4. `/src/types/auth.ts`

### Supporting Types (Medium Priority)
1. `/src/types/admin.types.ts`
2. `/src/types/notifications.ts`
3. `/src/types/settings.ts`

### Utility Types (Low Priority)
1. `/src/types/ui.d.ts`
2. `/src/types/recharts.d.ts`
3. `/src/types/global.d.ts`

## Implementation Guidelines

1. **No Visual Changes**
   - All type improvements must be internal
   - No UI/UX modifications
   - No component structure changes

2. **Backward Compatibility**
   - Maintain existing type structures
   - Use union types for backwards compatibility
   - Add new types alongside existing ones

3. **Testing Strategy**
   - Add type tests using TypeScript's type checking
   - No runtime behavior changes
   - TypeScript compiler strict mode validation

## Detailed Implementation Examples

### 1. Booking and Service Types

#### Current Implementation
```typescript
// In src/types/redux/index.ts
export interface Booking {
  id: string;
  userId: string;
  serviceType: 'repair' | 'maintenance' | 'installation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;  // Note: using string for date
  address: string;
  notes?: string;
  technicianId?: string;
  price?: number;
}

// In src/types/service.ts
export interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: string;  // Note: not using union type
  scheduledTime: Date;  // Note: inconsistent date type
  // ... more fields
}
```

#### Improved Implementation
```typescript
// Shared types
export type ServiceType = 'repair' | 'maintenance' | 'installation';
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in-progress'
  | 'completed' 
  | 'cancelled';

// Base interface for common fields
interface BaseBooking {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Improved Booking interface
export interface Booking extends BaseBooking {
  userId: string;
  serviceType: ServiceType;
  status: BookingStatus;
  scheduledDate: Date;  // Consistent date type
  address: Address;     // Structured address type
  notes: string | null; // Explicit null instead of optional
  technicianId: string | null;
  price: number | null;
}

// Structured Address type
export interface Address {
  blockStreet: string;
  floorUnit: string;
  postalCode: string;
  condoName: string | null;
  lobbyTower: string | null;
}
```

### 2. Payment Processing Types

#### Current Implementation
```typescript
// In src/types/payment.ts
export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: 'card' | 'paynow';
  metadata?: Record<string, string>;
}

export interface PaymentIntent {
  readonly id: string;
  readonly clientSecret: string;
  readonly amount: number;
  readonly status: string; // Note: using string instead of union
}
```

#### Improved Implementation
```typescript
export type PaymentMethod = 'card' | 'paynow';
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';

export interface PaymentDetails {
  amount: number;
  currency: 'SGD';  // Specific to your use case
  description: string;
  paymentMethod: PaymentMethod;  // Required field
  metadata: Record<string, string> | null;
}

export interface PaymentIntent {
  readonly id: string;
  readonly clientSecret: string;
  readonly amount: number;
  readonly status: PaymentStatus;
  readonly createdAt: Date;
  readonly lastProcessedAt: Date | null;
}

// Type guard for payment status
export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['pending', 'processing', 'succeeded', 'failed', 'refunded'].includes(status);
}
```

### 3. Error Handling Types

#### Current Implementation
```typescript
// Current error handling
catch (error: any) {  // Using any
  dispatch(setError(error.message));
}
```

#### Improved Implementation
```typescript
// Custom error types
export class BookingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'BookingError';
  }
}

export class PaymentError extends Error {
  constructor(
    message: string,
    public readonly transactionId: string,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Type guard
export function isBookingError(error: unknown): error is BookingError {
  return error instanceof BookingError;
}

// Usage in error handling
try {
  // ... booking logic
} catch (error: unknown) {
  if (isBookingError(error)) {
    dispatch(setError({
      message: error.message,
      code: error.code,
      retryable: error.retryable
    }));
  } else {
    dispatch(setError({
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      retryable: false
    }));
  }
}
```

## Benefits of These Improvements

1. **Type Safety**
   - Eliminates runtime errors from undefined checks
   - Ensures consistent data structures
   - Provides better TypeScript inference

2. **Developer Experience**
   - Better IDE autocomplete
   - Clearer error messages during development
   - Self-documenting code

3. **Maintainability**
   - Easier to refactor
   - Consistent patterns across codebase
   - Clear boundaries between types

4. **Error Handling**
   - Structured error types
   - Better error recovery
   - Improved debugging

## Implementation Strategy

1. **Phase 1: Core Types**
   - Implement shared types (ServiceType, BookingStatus, etc.)
   - Update base interfaces
   - Add type guards

2. **Phase 2: Service Layer**
   - Update service interfaces
   - Implement error types
   - Add validation functions

3. **Phase 3: State Management**
   - Update Redux state types
   - Implement action types
   - Add selector types

## Risks and Mitigations

### Risks
1. Type inference breaks in existing code
2. Runtime type mismatches
3. Build process complications

### Mitigations
1. Gradual implementation approach
2. Comprehensive type testing
3. Maintain type documentation

## Next Steps

1. Review and approve type definitions
2. Create implementation schedule
3. Begin with high-priority items
4. Regular type-checking validation

## Notes

- This plan focuses solely on type safety improvements
- No functional changes will be made
- All improvements are TypeScript-level only
- No impact on runtime behavior
- Preserves existing codebase structure

---

Last Updated: 2024-12-25
