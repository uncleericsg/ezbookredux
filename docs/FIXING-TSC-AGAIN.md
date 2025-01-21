# TypeScript Error Resolution Plan
Last Updated: January 2024

## Current Status
- Total Errors: 1139 errors in 310 files
- Major Impact Areas:
  - Admin Components
  - Booking Components
  - Hooks
  - Test Files
  - Notification Components

## Root Causes Analysis

### 1. Type Definition Mismatches
- [ ] Shared types not properly imported/utilized
- [ ] Incomplete prop type definitions
- [ ] Inconsistent type usage between frontend and backend

### 2. Path Resolution Issues
- [ ] Path alias resolution problems
- [ ] Inconsistent import paths
- [ ] Module resolution conflicts

### 3. Type Safety Gaps
- [ ] Missing type annotations
- [ ] Usage of 'any' type
- [ ] Incomplete interface definitions

## Implementation Plan

### Phase 1: Foundation (High Priority Files)

#### 1.1 Admin Components
- [x] AdminBookings.tsx (7 errors)
  - [x] Fixed import paths (@admin alias to @components/admin)
  - [x] Used shared types (Booking) instead of server types
  - [x] Added component return type (React.FC)
  - [x] Added proper hook result types (UseBookingResult interface)
  - [x] Implemented null safety for user object
  - [x] Added error state type
  - [x] Added loading state type

Patterns Discovered:
1. Component Props Pattern:
```typescript
// Always use React.FC with explicit prop interface
interface ComponentProps {
  // Props here
}
const Component: React.FC<ComponentProps> = () => {
  // Implementation
};
```

2. Hook Result Pattern:
```typescript
// Define explicit interface for hook results
interface UseHookResult {
  loading: boolean;
  error: string | null;
  data?: T[];
  actions: {
    // Action methods
  };
}
```

3. Error Handling Pattern:
```typescript
try {
  // Async operations
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  toast.error(errorMessage);
}
```

4. Type Migration Pattern:
- When moving from server types to shared types:
  - Check property names (e.g., customer_info → customerId)
  - Consider data relationships (might need separate fetching)
  - Update UI to handle new data structure

Notes:
- Customer and service details now need to be fetched separately due to normalized data structure
- Consider implementing a data fetching hook for related entities
- May need to update other components using similar patterns

Specific Issues:
```typescript
// Current issues in AdminBookings.tsx
1. Import path: import AdminHeader from '@admin/AdminHeader'
2. Type import: import type { BookingDetails } from '@server/types/booking'
3. Missing return type: const AdminBookings = () =>
4. Incomplete hook types: const { loading, error, fetchBookingsByEmail } = useBooking()
5. Null safety: if (!user?.email)
6. Missing error type: catch (err)
```

Planned fixes:
```typescript
// 1. Update imports to use proper path aliases
import AdminHeader from '@components/admin/AdminHeader';

// 2. Use shared types
import type { BookingDetails } from '@shared/types/booking';

// 3. Add component return type
const AdminBookings: React.FC = () => {

// 4. Add proper hook result types
interface UseBookingResult {
  loading: boolean;
  error: string | null;
  fetchBookingsByEmail: (email: string) => Promise<{
    data?: BookingDetails[];
    error?: string;
  }>;
}

// 5. Add proper error handling type
catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  toast.error(errorMessage);
}
```

- [x] AdminPanelLoader.tsx (11 errors)
  - [x] Fixed import paths (@admin alias to @components/admin)
  - [x] Added proper lazy loading component types
  - [x] Added component return type
  - [x] Fixed Panel component type
  - [x] Added error boundary types
  - [x] Added proper Suspense types

New Patterns Discovered:

1. Lazy Loading Pattern:
```typescript
// Define base props for components
interface BaseProps {}

// Type for both class and function components
type ComponentType = React.ComponentType<BaseProps>;

// Helper function for dynamic imports
const loadComponent = (
  importFn: () => Promise<{ default: ComponentType }>,
  fallbackName: string
): Promise<{ default: ComponentType }> => {
  return importFn().catch(() => ({ 
    default: createErrorComponent(fallbackName)
  }));
};

// Usage
const Components = {
  component: lazy(() => loadComponent(
    () => import("@components/path/Component"),
    "Component Name"
  ))
};
```

2. Error Boundary Pattern:
```typescript
// Error component with proper typing
interface ErrorFallbackProps {
  name: string;
}

const ErrorFallback = memo<ErrorFallbackProps>(({ name }) => (
  <div>Error loading {name}</div>
));

ErrorFallback.displayName = 'ErrorFallback';
```

3. Dynamic Import Type Safety:
```typescript
// Helper types for dynamic imports
type DynamicImport = Promise<{ default: ComponentType }>;
type LazyComponent = React.LazyExoticComponent<ComponentType>;

// Type-safe record of components
const Components: Record<string, LazyComponent> = {
  // components here
};
```

Notes:
- Proper typing of lazy-loaded components requires careful handling of both class and function components
- Error boundaries should be properly typed and memoized
- Helper functions can encapsulate error handling logic
- Consider using a base props interface for shared component props

Specific Issues:
```typescript
// Current issues in AdminPanelLoader.tsx
1. Import paths using @admin alias
2. Missing types for lazy loaded components
3. Missing return type for AdminPanelLoader
4. Incomplete Panel component type
5. Missing error boundary types
```

Planned fixes:
```typescript
// 1. Update import paths
import ServiceHub from '@components/admin/ServiceHub/ServiceHub';

// 2. Add proper lazy component types
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

const AdminPanels: Record<string, LazyComponent> = {
  services: lazy(() => 
    import('@components/admin/ServiceHub/ServiceHub')
      .catch(() => ({ 
        default: () => <ErrorFallback name="Services" /> 
      }))
  ),
  // ...
};

// 3. Add proper component return type
const AdminPanelLoader: React.FC<Props> = ({ panel }) => {

// 4. Add error boundary component
const ErrorFallback: React.FC<{ name: string }> = ({ name }) => (
  <div>Error loading {name}</div>
);

// 5. Add proper panel type
type AdminPanelType = keyof typeof AdminPanels;
```

- [ ] AdminSettings.tsx (13 errors)
  - [ ] Fix import paths (@admin alias to @components/admin)
  - [ ] Add proper settings form types
  - [ ] Add section handling types
  - [ ] Add error handling types
  - [ ] Add component return type
  - [ ] Add proper types for settings updates
  - [ ] Add proper types for API responses

Specific Issues:
```typescript
// Current issues in AdminSettings.tsx
1. Import paths using @admin alias
2. Missing proper types for useSettingsForm hook
3. Missing proper types for section handling
4. Missing error types for API calls
5. Missing return type for component
6. Missing proper types for settings updates
7. Missing proper types for API responses
```

Planned fixes:
```typescript
// 1. Settings Form Types
interface SettingsFormState<T> {
  settings: T;
  loading: boolean;
  updateSettings: (updates: Partial<T>) => void;
  handleSave: () => Promise<void>;
}

// 2. Section Types
interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// 3. API Response Types
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// 4. Error Handling Types
interface ApiError extends Error {
  code?: string;
  response?: {
    status: number;
    data: any;
  };
}

// 5. Component Implementation
const AdminSettings: React.FC = () => {
  // Implementation
};
```

Implementation Strategy:
1. Fix import paths first
2. Add proper type definitions
3. Implement error handling
4. Add form validation
5. Add API response handling

#### 1.2 Booking Components
- [ ] PaymentStep.tsx (7 errors)
  - [ ] Fix payment state types
  - [ ] Add proper error handling types
  - [ ] Implement proper prop types

- [ ] FirstTimeBookingFlow.tsx (18 errors)
  - [ ] Add flow state types
  - [ ] Fix form handling types
  - [ ] Implement validation types

#### 1.3 Critical Hooks
- [ ] useUserRedux.ts (3 errors)
  - [ ] Fix state types
  - [ ] Add proper action types
  - [ ] Implement selector types

### Phase 2: Systematic Component Fixes

#### 2.1 Component Type Pattern Fixes
- [ ] Implement consistent prop typing pattern
- [ ] Add proper children typing
- [ ] Fix event handler types

#### 2.2 Hook Type Safety
- [ ] Implement proper generic types
- [ ] Fix state management types
- [ ] Add proper return type definitions

#### 2.3 Test File Types
- [ ] Add test utility types
- [ ] Fix mock type definitions
- [ ] Implement proper assertion types

### Phase 3: Infrastructure Updates

#### 3.1 Path Resolution
- [ ] Update tsconfig path mappings
- [ ] Fix module resolution
- [ ] Verify import paths

#### 3.2 Shared Types
- [ ] Centralize type definitions
- [ ] Implement proper type exports
- [ ] Add type documentation

## Error Categories Tracking

### Admin Components (Total: 89 errors)
- [ ] Component prop types
- [ ] State management types
- [ ] Event handler types

### Booking Components (Total: 127 errors)
- [ ] Form handling types
- [ ] Validation types
- [ ] State management types

### Hooks (Total: 98 errors)
- [ ] State types
- [ ] Effect types
- [ ] Return type definitions

### Test Files (Total: 73 errors)
- [ ] Mock types
- [ ] Assertion types
- [ ] Utility types

### Notification Components (Total: 152 errors)
- [ ] Message types
- [ ] Template types
- [ ] State management types

## Best Practices Implementation

### Type Guards
```typescript
// Example implementation
function isError(error: unknown): error is Error {
  return error instanceof Error;
}
```

### Utility Types
```typescript
// Example implementation
type RequiredProps<T> = {
  [K in keyof T]-?: T[K];
};
```

## Progress Tracking

### Completed
- [ ] Initial analysis
- [ ] Documentation setup
- [ ] Root cause identification

### In Progress
- [ ] Phase 1: Foundation fixes
- [ ] Critical component fixes
- [ ] Hook type implementation

### Pending
- [ ] Phase 2: Systematic fixes
- [ ] Phase 3: Infrastructure updates
- [ ] Best practices implementation

## Verification Process

### Pre-Commit Checks
1. Run `tsc --noEmit`
2. Verify no new type errors
3. Check path resolution
4. Validate imports

### Post-Fix Verification
1. Component rendering
2. Hook functionality
3. Test execution
4. Build process

## Notes
- Keep track of fixed files in this document
- Update error counts after each major fix
- Document any patterns discovered during fixes
- Note any breaking changes introduced

## Next Steps
1. Begin with Phase 1 high-priority files
2. Track progress in this document
3. Update error counts regularly
4. Document successful patterns
5. Implement preventive measures
