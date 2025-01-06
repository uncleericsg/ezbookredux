# Root Error Boundary Implementation Plan

## Current Situation

Multiple error boundary implementations exist across the project, creating unnecessary complexity and maintenance overhead.

## Simplified Solution

### Core Implementation

Two focused files:

1. ErrorBoundary.tsx
```typescript
interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error) => void;
}

export class ErrorBoundary extends Component<Props, State> {
  // Core error boundary logic
}
```

2. ErrorFallback.tsx
```typescript
interface Props {
  error: Error;
}

export const ErrorFallback: React.FC<Props> = ({ error }) => (
  // Basic error display
);
```

### Design Principles

1. Core Files:
   - Keep minimal and focused
   - Handle only essential error boundary logic
   - Provide flexible props interface
   - Maintain single responsibility

2. Consumer Components:
   - Handle complex error logic
   - Implement custom UI
   - Manage business-specific error handling
   - Handle animations and styling

### Usage Examples

1. Basic Usage:
```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

2. Lazy Loading Protection:
```tsx
// Protect against chunk loading failures
<ErrorBoundary
  fallback={(error) => (
    <ChunkLoadError
      error={error}
      retry={() => window.location.reload()}
    />
  )}
>
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>

// Router-level protection
const HomePage = lazy(() => import('@components/home'));
const HomeRoute = () => (
  <ErrorBoundary
    fallback={(error) => (
      <RouteLoadError
        error={error}
        retry={() => window.location.reload()}
      />
    )}
  >
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  </ErrorBoundary>
);
```

2. Custom Error UI:
```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <PaymentFlow />
</ErrorBoundary>
```

3. Dynamic Error Handling:
```tsx
<ErrorBoundary
  fallback={(error) => <PaymentErrorUI error={error} />}
  onError={logErrorToService}
>
  <CheckoutFlow />
</ErrorBoundary>
```

## Implementation Steps

1. Create New Files:
   ```bash
   - src/components/ErrorBoundary.tsx
   - src/components/ErrorFallback.tsx
   ```

2. Update Imports:
   - Replace all error boundary imports with new implementation
   - Remove old error boundary files
   - Update component usage patterns

3. Testing:
   - Unit test core error boundary
   - Test error fallback rendering
   - Verify error handling in each context

## Benefits

1. Maintenance:
   - Two files to maintain
   - Clear separation of concerns
   - Simple to understand and modify

2. Flexibility:
   - Supports all current use cases
   - Extensible through composition
   - Type-safe implementation

3. Performance:
   - Minimal bundle size
   - No unnecessary abstractions
   - Efficient error handling

## Migration Guide

1. Basic Components:
```tsx
// Old
<ConsolidatedErrorBoundary>
  <Component />
</ConsolidatedErrorBoundary>

// New
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

2. Enhanced Features:
```tsx
// Old
<EnhancedErrorBoundary useFeatures={true}>
  <Component />
</EnhancedErrorBoundary>

// New
<ErrorBoundary
  fallback={(error) => <EnhancedErrorUI error={error} />}
  onError={handleError}
>
  <Component />
</ErrorBoundary>
```

3. Section-Specific:
```tsx
// Old
<SectionErrorBoundary section="welcome">
  <Section />
</SectionErrorBoundary>

// New
<ErrorBoundary
  fallback={(error) => <SectionErrorUI section="welcome" error={error} />}
>
  <Section />
</ErrorBoundary>
```

## Future Considerations

1. Error Reporting:
   - Implement through onError prop
   - Keep core files focused
   - Handle in consumer components

2. UI Enhancements:
   - Implement in consumer components
   - Use composition for complex UIs
   - Maintain separation of concerns

3. Testing:
   - Focus on core functionality
   - Test error scenarios
   - Verify consumer implementations