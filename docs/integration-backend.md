# Backend Integration Plan

## Overview

This document outlines the systematic approach to integrate the new backend services with the frontend application, focusing on payment processing and receipt handling.

## Current Structure Analysis

### Frontend Components
```
src/
├── components/booking/
│   ├── PaymentStep.tsx (30KB)
│   ├── BookingConfirmation.tsx (8.9KB)
│   └── PaymentStep.Full.UI.Working.tsx (23KB, backup)
├── hooks/
│   ├── usePayment.ts (1.2KB)
│   └── useBooking.ts (2.6KB)
├── services/
│   ├── stripe.ts (4.9KB)
│   ├── paymentService.ts (11KB)
│   └── supabaseBookingService.ts (7.2KB)
└── types/
    ├── payment.ts
    └── booking.ts
```

### Backend Services
```
server/
├── services/stripe/
│   ├── paymentService.ts
│   └── receiptService.ts
├── utils/
│   └── logger.ts
└── config/
    └── database.ts
```

## Phase 1: TypeScript Configuration and Type Definitions

### 1.1 Update TypeScript Configuration
```json
{
  "compilerOptions": {
    "paths": {
      "@server/*": ["./server/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

### 1.2 Create/Update Type Definitions

#### New Type Files
1. `src/types/api.ts`:
```typescript
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

2. `src/types/webhook.ts`:
```typescript
export interface WebhookEventPayload {
  type: string;
  data: {
    object: Record<string, any>;
  };
}
```

#### Update Existing Types
1. `src/types/payment.ts`:
```typescript
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ReceiptData {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  booking: {
    scheduled_at: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
      mobile: string;
    };
    service: {
      title: string;
      duration: string;
      price: number;
    };
  };
}
```

## Phase 2: Service Layer Integration

### 2.1 Update Stripe Service
1. Update API endpoints
2. Implement new service methods
3. Add proper error handling
4. Update type definitions

```typescript
// src/services/stripe.ts
const API_ENDPOINTS = {
  createPaymentIntent: '/api/payments/create-payment-intent',
  getReceipt: '/api/payments/receipt',
  generateReceipt: '/api/payments/receipt/generate'
};
```

### 2.2 Update Payment Service
1. Implement new payment methods
2. Add receipt handling
3. Update error handling
4. Add logging integration

## Phase 3: Hook Layer Updates

### 3.1 Update usePayment Hook
1. Implement new payment flow
2. Add receipt handling
3. Update error handling
4. Add loading states

```typescript
export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const processPayment = async (params: CreatePaymentIntentParams) => {
    // Implementation
  };

  return { loading, error, processPayment };
};
```

## Phase 4: Component Updates

### 4.1 Update PaymentStep Component
1. Implement new payment flow
2. Add loading states
3. Update error handling
4. Add receipt generation

### 4.2 Update BookingConfirmation Component
1. Implement receipt display
2. Add download functionality
3. Update error handling

## Phase 5: Testing and Validation

### 5.1 Unit Tests
1. Service layer tests
2. Hook tests
3. Type validation tests

### 5.2 Integration Tests
1. Payment flow tests
2. Receipt generation tests
3. Error handling tests

### 5.3 End-to-End Tests
1. Complete booking flow
2. Payment processing
3. Receipt generation and download

## Implementation Checklist

### Phase 1: TypeScript Setup ⚙️
- [ ] Update tsconfig.json
- [ ] Create new type definition files
- [ ] Update existing type definitions
- [ ] Validate type configurations

### Phase 2: Service Layer 🔄
- [ ] Update API endpoints
- [ ] Implement new service methods
- [ ] Add error handling
- [ ] Update type implementations
- [ ] Add logging integration

### Phase 3: Hook Layer 🎣
- [ ] Update usePayment hook
- [ ] Add new payment methods
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Update type implementations

### Phase 4: Components 🎨
- [ ] Update PaymentStep
- [ ] Update BookingConfirmation
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Add receipt functionality

### Phase 5: Testing 🧪
- [ ] Write unit tests
- [ ] Implement integration tests
- [ ] Create E2E tests
- [ ] Validate type safety
- [ ] Test error scenarios

## Error Handling Strategy

### 1. Service Layer Errors
```typescript
try {
  // Service operation
} catch (error) {
  logger.error('Operation failed', { error });
  throw new PaymentError(error.message);
}
```

### 2. Hook Layer Errors
```typescript
try {
  // Hook operation
} catch (error) {
  setError(error);
  toast.error(error.message);
}
```

### 3. Component Layer Errors
```typescript
{error && (
  <ErrorAlert
    message={error.message}
    action={retryOperation}
  />
)}
```

## Rollback Strategy

### 1. Service Layer
- Keep old service methods until new ones are verified
- Implement feature flags for new functionality
- Maintain backwards compatibility

### 2. Component Layer
- Keep backup versions of components
- Implement gradual rollout
- Monitor error rates

## Success Metrics

### 1. Type Safety
- Zero TypeScript errors
- Complete type coverage
- No any types in critical paths

### 2. Performance
- Payment processing under 2s
- Receipt generation under 1s
- Error handling under 100ms

### 3. Reliability
- 99.9% success rate for payments
- Zero unhandled errors
- Complete error tracking

## Timeline

1. Phase 1: 1 day
2. Phase 2: 2 days
3. Phase 3: 1 day
4. Phase 4: 2 days
5. Phase 5: 3 days

Total: 9 days

## Dependencies

### Required Packages
```json
{
  "@stripe/stripe-js": "latest",
  "date-fns": "latest",
  "pdfkit": "latest",
  "@types/stripe": "latest"
}
```

### Environment Variables
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Next Steps

1. Begin with Phase 1: TypeScript Configuration
2. Create new type definition files
3. Update existing type definitions
4. Proceed with service layer updates

## Support and Resources

- Stripe API Documentation
- TypeScript Documentation
- Project Documentation
- Team Contact Information 