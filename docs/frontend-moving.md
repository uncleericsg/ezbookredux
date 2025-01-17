# Frontend Migration Plan
Last Updated: January 17, 2024

## Overview
This document outlines the frontend migration strategy to integrate with our simplified Stripe Checkout payment system. The focus is on creating a seamless booking and payment experience while leveraging Stripe's hosted checkout page.

## Current Status

### Completed (✅)
- Basic booking flow
- User authentication
- Service selection
- Basic error handling

### In Progress (🚧)
- Payment integration
- Success/cancel pages
- Loading states
- Error boundaries

### Pending (📅)
- Analytics integration
- Enhanced error handling
- Responsive design improvements
- Performance optimizations

## Architecture Changes

### 1. Directory Structure
```
src/
├── components/
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── ServiceSelection.tsx
│   │   └── PaymentButton.tsx
│   └── payment/
│       ├── CheckoutButton.tsx
│       ├── PaymentStatus.tsx
│       └── PaymentSuccess.tsx
├── pages/
│   ├── bookings/
│   │   ├── [id]/
│   │   │   ├── success.tsx
│   │   │   └── cancel.tsx
│   │   └── new.tsx
│   └── payments/
│       └── status.tsx
└── services/
    └── api/
        └── payment.ts
```

### 2. New Components

#### CheckoutButton Component
```typescript
interface CheckoutButtonProps {
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  bookingId,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
          customerEmail: user.email
        })
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      loading={loading}
      disabled={loading}
    >
      Proceed to Payment
    </Button>
  );
};
```

### 3. API Integration

#### Payment Service
```typescript
// services/api/payment.ts
export const paymentApi = {
  async initiateCheckout(params: CheckoutParams) {
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    return response.json();
  },

  async getPaymentStatus(sessionId: string) {
    const response = await fetch(`/api/payments/checkout?session_id=${sessionId}`);
    return response.json();
  }
};
```

## Implementation Plan

### Phase 1: Core Integration (Current)

1. Success/Cancel Pages
```typescript
// pages/bookings/[id]/success.tsx
export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState<PaymentStatus>();

  useEffect(() => {
    if (session_id) {
      paymentApi.getPaymentStatus(session_id as string)
        .then(result => setStatus(result.status));
    }
  }, [session_id]);

  return (
    <PaymentSuccess
      status={status}
      onContinue={() => router.push('/bookings')}
    />
  );
}
```

2. Payment Button Integration
```typescript
// components/booking/BookingForm.tsx
export default function BookingForm() {
  const { booking } = useBooking();
  
  return (
    <Form>
      {/* Booking fields */}
      <CheckoutButton
        bookingId={booking.id}
        amount={booking.amount}
        currency="usd"
        onError={error => toast.error(error.message)}
      />
    </Form>
  );
}
```

### Phase 2: Enhanced Features

1. Loading States
```typescript
interface LoadingState {
  checkout: boolean;
  status: boolean;
}

const [loading, setLoading] = useState<LoadingState>({
  checkout: false,
  status: false
});
```

2. Error Boundaries
```typescript
class PaymentErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### 1. Unit Tests
- Component rendering
- Button states
- API integration
- Error handling

### 2. Integration Tests
- Complete booking flow
- Payment initiation
- Success/cancel flows
- Error scenarios

### 3. E2E Tests
- Full booking process
- Payment completion
- Navigation flows
- Error recovery

## Migration Steps

### Week 1: Core Implementation
1. Create new component structure
2. Implement CheckoutButton
3. Add success/cancel pages
4. Basic error handling

### Week 2: Enhancement
1. Add loading states
2. Implement error boundaries
3. Add analytics
4. Improve UX

### Week 3: Testing & Polish
1. Write unit tests
2. Add integration tests
3. E2E test coverage
4. Performance optimization

## Success Criteria

### 1. User Experience
- [ ] Seamless payment flow
- [ ] Clear success/failure states
- [ ] Responsive loading indicators
- [ ] Intuitive error messages

### 2. Technical Quality
- [ ] Type safety
- [ ] Error boundary coverage
- [ ] Test coverage
- [ ] Performance metrics

### 3. Monitoring
- [ ] Error tracking
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] User feedback collection

## Notes
- Focus on user experience first
- Maintain type safety throughout
- Keep error handling comprehensive
- Document component usage
- Regular performance checks 