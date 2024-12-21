# Phase 1: Auth Migration Issues Prevention Plan

## 1. Pre-Migration Analysis & Setup

### 1.1 Current Auth Dependencies Audit
- [x] Identified all files using AuthContext/useAuth
  - Core: `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`
  - Components: BookingFlow, AdminViewToggle, ProtectedRoute, PublicRoute, Layout
  - Services: firebaseValidation.ts
  - Router: router.tsx

### 1.2 Feature Verification
- [ ] Document current auth features:
  - User state management
  - Local storage persistence
  - Route protection
  - Role-based access control
  - Firebase phone authentication
  - Navigation integration

### 1.3 Type Safety Setup
- [ ] Create/verify TypeScript interfaces:
  ```typescript
  // src/types/auth.ts
  interface User {
    id: string;
    email: string;
    role: 'admin' | 'amc' | 'regular';
    amcStatus?: 'active' | 'inactive';
    // ... other user fields
  }

  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  ```

## 2. Risk Mitigation Strategy

### 2.1 State Management Risks
- [ ] Create state snapshot utility
  ```typescript
  // src/utils/stateSnapshot.ts
  const createStateSnapshot = () => {
    const authUser = localStorage.getItem('auth_user');
    return {
      timestamp: new Date().toISOString(),
      authState: authUser ? JSON.parse(authUser) : null
    };
  };
  ```

### 2.2 Route Protection Risks
- [ ] Implement temporary dual-auth check
  ```typescript
  // src/components/ProtectedRoute.tsx
  const useDualAuth = () => {
    const contextAuth = useAuth();
    const reduxAuth = useAppSelector(state => state.auth);
    return {
      isAuthenticated: contextAuth.user || reduxAuth.user,
      loading: contextAuth.loading || reduxAuth.loading
    };
  };
  ```

### 2.3 Firebase Integration Risks
- [ ] Create auth service adapter
  ```typescript
  // src/services/auth/adapter.ts
  class AuthServiceAdapter {
    private legacyAuth: typeof AuthContext;
    private reduxAuth: typeof authSlice;
    
    async authenticate() {
      // Handle both old and new auth
    }
  }
  ```

## 3. Testing Infrastructure

### 3.1 Test Cases Required
- [ ] Auth State Tests
  - User login/logout flow
  - Token management
  - Persistence
  - Error handling

- [ ] Route Protection Tests
  - Protected route access
  - Public route behavior
  - Role-based access

- [ ] Component Integration Tests
  - BookingFlow auth integration
  - AdminViewToggle permissions
  - Layout auth-dependent features

### 3.2 Test Utils Setup
```typescript
// src/utils/test/authTestUtils.ts
export const mockAuthState = {
  user: null,
  loading: false,
  error: null,
  token: null
};

export const mockUser = {
  id: 'test-id',
  role: 'regular'
  // ... other fields
};
```

## 4. Rollback Strategy

### 4.1 Feature Flags
```typescript
// src/config/features.ts
export const AUTH_FLAGS = {
  USE_REDUX_AUTH: false,
  ENABLE_DUAL_AUTH: true,
  PERSIST_OLD_AUTH: true
};
```

### 4.2 Backup Points
- [ ] Create backup branches:
  ```bash
  git checkout -b backup/auth-pre-migration
  git checkout -b feature/auth-migration
  ```

### 4.3 Monitoring Points
- [ ] Add logging for auth state changes
- [ ] Track auth performance metrics
- [ ] Monitor error rates

## 5. Implementation Checklist

### 5.1 Preparation Phase
- [ ] Create new type definitions
- [ ] Set up test infrastructure
- [ ] Implement feature flags
- [ ] Create state snapshots

### 5.2 Core Updates
- [ ] Create new Redux auth slice
- [ ] Implement persistence middleware
- [ ] Set up auth thunks
- [ ] Create new useAuth hook

### 5.3 Component Migration Order
1. [ ] Route Protection Components
   - ProtectedRoute.tsx
   - PublicRoute.tsx
2. [ ] Layout Component
3. [ ] Admin Components
4. [ ] Booking Components

### 5.4 Verification Points
- [ ] Auth state persistence
- [ ] Protected route behavior
- [ ] Admin role checks
- [ ] Booking flow integration
- [ ] Firebase auth integration

## 6. Monitoring & Validation

### 6.1 Success Metrics
- [ ] All auth tests passing
- [ ] No auth-related errors in console
- [ ] Protected routes working as expected
- [ ] Admin features accessible only to admins
- [ ] Booking flow maintaining auth state

### 6.2 Performance Metrics
- [ ] Auth state update time
- [ ] Route transition time
- [ ] Memory usage
- [ ] Network requests

## 7. Documentation Requirements

### 7.1 Code Documentation
- [ ] New Redux actions and reducers
- [ ] Updated component props
- [ ] Auth utility functions
- [ ] Test cases

### 7.2 Migration Guide
- [ ] Component migration steps
- [ ] New auth hook usage
- [ ] Route protection changes
- [ ] Firebase integration updates

## 8. Timeline & Milestones

### Week 1
- Days 1-2: Setup and preparation
- Days 3-4: Core implementation
- Day 5: Initial testing

### Week 2
- Days 1-3: Component migration
- Days 4-5: Testing and validation

### Week 3
- Days 1-2: Performance optimization
- Days 3-4: Documentation
- Day 5: Final review and deployment
