# Root Error Boundary Migration Analysis

## Current Implementation Audit

Files found through comprehensive search patterns:

1. Import Pattern Search:
   ```regex
   (import.*Error(Boundary|Fallback)|from.*Error(Boundary|Fallback))
   ```

2. JSX Component Usage Search:
   ```regex
   <ErrorBoundary|ErrorFallback
   ```

3. Component Property Search:
   ```regex
   component={[^}]*Error(?:Boundary|Fallback)|<Error(?:Boundary|Fallback)[^>]*>
   ```

## Additional Considerations: Lazy Loading

### 1. Lazy-Loaded Components
Key areas using React.lazy:
- Router level (src/router.tsx)
- Home page sections (src/components/home/index.tsx)
- Booking flow (src/components/booking/*)
- Admin panels (src/components/admin/AdminPanelLoader.tsx)

### 2. Error Handling for Lazy Components
These components need error boundary protection for:
- Chunk loading failures
- Network errors
- Module loading issues

### 3. Recommended Implementation
```tsx
// For lazy-loaded routes
<ErrorBoundary
  fallback={(error) => <ChunkErrorFallback error={error} retry={() => window.location.reload()} />}
>
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

## Files Requiring Updates

### 1. Main Application
File: src/main.tsx
```typescript
// Current
import ConsolidatedErrorBoundary from './components/ConsolidatedErrorBoundary'
<ConsolidatedErrorBoundary fallback={<ErrorFallback />} useEnhancedFeatures={true}>

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
<ErrorBoundary>
```

### 2. Booking Components
a. src/components/booking/PaymentStep.Full.UI.Working.tsx
```typescript
// Current
import EnhancedErrorBoundary from '@components/EnhancedErrorBoundary'
<EnhancedErrorBoundary>

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
<ErrorBoundary
  fallback={(error) => <PaymentErrorUI error={error} />}
  onError={handlePaymentError}
>
```

b. src/components/booking/OptimizedLocationProvider.tsx
```typescript
// Current
import ConsolidatedErrorBoundary from '../ConsolidatedErrorBoundary'
<ConsolidatedErrorBoundary useEnhancedFeatures={true}>

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
<ErrorBoundary onError={handleLocationError}>
```

### 3. Notification Components
File: src/components/notifications/NotificationTemplateEditor.tsx
```typescript
// Current
import { ErrorBoundary } from './ErrorBoundary'
<ErrorBoundary>

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
<ErrorBoundary>
```

### 4. Home Components
File: src/components/home/index.tsx
```typescript
// Current
import SectionErrorBoundary from './utils/ErrorBoundary'
<SectionErrorBoundary section="welcome">

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
<ErrorBoundary
  fallback={(error) => <SectionErrorUI section="welcome" error={error} />}
>
```

### 5. Service Scheduling
File: src/components/ServiceScheduling.tsx
```typescript
// Current
const BookingErrorFallback = ...

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
// Move error UI logic to consumer component
```

## Files to Remove

1. Error Boundary Implementations:
   - src/components/ConsolidatedErrorBoundary.tsx
   - src/components/ErrorBoundary.tsx
   - src/components/EnhancedErrorBoundary.tsx
   - src/components/home/utils/ErrorBoundary.tsx
   - src/components/notifications/ErrorBoundary.tsx
   - src/components/payment/PaymentErrorBoundary.tsx

2. Error Fallbacks to Move:
   - Inline ErrorFallback in main.tsx → Move to consumer
   - BookingErrorFallback in ServiceScheduling.tsx → Move to consumer
   - src/components/error-boundary/ErrorFallback.tsx → Replace with new implementation

## Test Files to Update

1. src/components/notifications/__tests__/HolidayGreetingModal.test.tsx
```typescript
// Current
import { ErrorBoundary } from '../ErrorBoundary'

// New
import { ErrorBoundary } from '@components/ErrorBoundary'
```

## Migration Steps

1. Create New Files:
   ```bash
   mkdir -p src/components
   touch src/components/ErrorBoundary.tsx
   touch src/components/ErrorFallback.tsx
   ```

2. Implementation Order:
   a. Create and test new ErrorBoundary and ErrorFallback
   b. Update main.tsx first
   c. Migrate booking components
   d. Update home sections
   e. Convert notification components
   f. Update service scheduling
   g. Update tests
   h. Remove old files

## Verification Checklist

1. Core Functionality:
   - [ ] Error catching works
   - [ ] Error reporting functions
   - [ ] Fallback UI displays correctly
   - [ ] Development mode details show

2. Consumer Components:
   - [ ] Custom error UIs work
   - [ ] Error handlers execute
   - [ ] Business logic maintained
   - [ ] Styling preserved

3. Testing:
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Error scenarios covered
   - [ ] UI rendering verified

## Notes

1. Approach Benefits:
   - Minimal core implementation
   - Clear separation of concerns
   - Flexible error handling
   - Type-safe props

2. Migration Considerations:
   - No breaking changes in error handling
   - Maintains all current functionality
   - Simpler mental model
   - Better maintainability

This analysis confirms that our simplified two-file approach can handle all current use cases while significantly reducing complexity and maintenance burden.