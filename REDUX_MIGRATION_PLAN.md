# Redux Migration Plan

## Overview
This document outlines the systematic plan for migrating from React Context to Redux in the iAircon EasyBooking project. The migration will be done in phases to ensure stability and maintainability.

## Current State
- Primary state management: Redux Toolkit
- Secondary state management: Context API (to be migrated)
- TypeScript with strict mode enabled
- Current contexts to migrate:
  - AuthContext
  - UserContext
  - AdminViewContext
  - CombinedUserContext

## Phase 1: Auth Context Migration
**Target**: Migrate `AuthContext` to `authSlice`

### Files to Update
- `src/contexts/AuthContext.tsx` → Remove after migration
- `src/store/slices/authSlice.ts` → Enhance with current context functionality
- Components using `useAuth`:
  - `src/components/PublicRoute.tsx`
  - `src/components/admin/AdminDashboard.tsx`

### Implementation Steps
1. **Enhance authSlice.ts**
   ```typescript
   interface AuthState {
     isAuthenticated: boolean;
     token: string | null;
     loading: boolean;
     error: string | null;
     user: User | null;
   }

   const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
       login: (state, action) => {...},
       logout: (state) => {...},
       setAuthError: (state, action) => {...},
       clearAuthError: (state) => {...}
     }
   });
   ```

2. **Create New Auth Hook**
   ```typescript
   // src/hooks/useAuth.ts
   export const useAuth = () => {
     const auth = useAppSelector(state => state.auth);
     const dispatch = useAppDispatch();
     // Implement auth methods
   };
   ```

3. **Update Components**
   - Replace all `useAuth` imports
   - Update component logic to use Redux

## Phase 2: User Context Migration
**Target**: Complete migration of UserContext to `userSlice`

### Files to Update
- `src/contexts/UserContext.tsx` → Remove
- `src/store/slices/userSlice.ts` → Enhance
- Components using `useUser`:
  - `src/components/booking/CustomerForm.tsx`
  - `src/components/ServiceScheduling.tsx`
  - `src/hooks/useAppointments.ts`

### Implementation Steps
1. **Enhance userSlice**
   ```typescript
   interface UserState {
     currentUser: User | null;
     loading: boolean;
     error: string | null;
     bookings: Booking[];
     preferences: UserPreferences;
   }

   export const fetchUserProfile = createAsyncThunk(
     'user/fetchProfile',
     async (userId: string) => {...}
   );
   ```

2. **Update useUserRedux Hook**
   - Add all current UserContext functionality
   - Implement proper error handling
   - Add TypeScript types

3. **Component Migration**
   - Update imports
   - Replace context calls with Redux
   - Add proper error boundaries

## Phase 3: Admin Context Migration
**Target**: Migrate `AdminViewContext` to `adminSlice`

### Files to Update
- `src/contexts/AdminViewContext.tsx` → Remove
- `src/store/slices/adminSlice.ts` → Enhance
- Components:
  - `src/components/admin/ViewSelector.tsx`
  - `src/components/admin/AdminTabs.tsx`
  - `src/components/admin/teams/TeamManagement.tsx`

### Implementation Steps
1. **Enhance adminSlice**
   ```typescript
   interface AdminState {
     isAdmin: boolean;
     adminData: AdminData | null;
     currentView: string;
     settings: AdminSettings;
     loading: boolean;
     error: string | null;
   }

   const adminSlice = createSlice({
     name: 'admin',
     initialState,
     reducers: {
       setCurrentView: (state, action) => {...},
       updateAdminSettings: (state, action) => {...}
     }
   });
   ```

2. **Create Admin Hooks**
   - Implement admin-specific hooks
   - Add proper TypeScript types

## Phase 4: Combined Context Migration
**Target**: Replace CombinedUserContext with Redux selectors

### Files to Update
- `src/contexts/CombinedUserContext.tsx` → Remove
- Create new selectors:
  - `src/store/selectors/userSelectors.ts`
  - `src/store/selectors/authSelectors.ts`
  - `src/store/selectors/adminSelectors.ts`

### Implementation Steps
1. **Create Combined Selectors**
   ```typescript
   export const selectUserWithAuth = createSelector(
     [selectUser, selectAuth],
     (user, auth) => ({
       user: user.currentUser,
       isAuthenticated: auth.isAuthenticated,
       loading: user.loading || auth.loading
     })
   );
   ```

2. **Create Combined Hook**
   ```typescript
   export const useCombinedState = () => {
     return useAppSelector(selectUserWithAuth);
   };
   ```

## Phase 5: Component Updates & Testing

### Component Migration Order
1. Leaf Components
2. Container Components
3. Page Components

### Testing Strategy
1. Write tests before migration
2. Ensure full coverage
3. Test edge cases
4. Verify performance

## Phase 6: Cleanup & Optimization

### Tasks
1. **Remove Old Code**
   - Delete all context files
   - Remove context providers from App.tsx
   - Clean up unused imports

2. **Performance Optimization**
   ```typescript
   export const selectMemoizedUserData = createSelector(
     [selectUser],
     user => user.data
   );
   ```

3. **Documentation Update**
   - Update README
   - Document new patterns
   - Update API documentation

## Migration Guidelines

### Best Practices
1. Each phase in separate branch
2. Write tests before migration
3. Use TypeScript strict mode
4. Maintain backward compatibility
5. Add proper error handling
6. Keep Redux state normalized
7. Use Redux Toolkit's createAsyncThunk for async operations

### Code Style
1. Use named exports
2. Follow existing naming conventions
3. Add proper TypeScript types
4. Document complex logic
5. Add error boundaries where needed

## Testing Checklist
- [ ] Unit tests for each slice
- [ ] Integration tests for connected components
- [ ] Performance tests
- [ ] Error handling tests
- [ ] Edge case coverage

## Documentation Requirements
- [ ] Update API documentation
- [ ] Add migration notes
- [ ] Update component documentation
- [ ] Add new patterns to style guide
- [ ] Document breaking changes

## Branch Strategy
- `redux/auth-migration`
- `redux/user-migration`
- `redux/admin-migration`
- `redux/combined-migration`
- `redux/cleanup`

## Rollback Plan
1. Keep old context code in separate branch
2. Document all changes
3. Maintain snapshot of working state
4. Test rollback procedures

## Timeline Estimates
- Phase 1: 2-3 days
- Phase 2: 2-3 days
- Phase 3: 1-2 days
- Phase 4: 1-2 days
- Phase 5: 2-3 days
- Phase 6: 1 day

Total: ~10-14 days

## Success Metrics
1. All tests passing
2. No context usage in codebase
3. Improved performance metrics
4. Complete TypeScript coverage
5. Updated documentation
