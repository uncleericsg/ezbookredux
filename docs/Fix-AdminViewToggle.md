# AdminViewToggle Component Analysis and Fix Plan
**Last Updated: December 26, 2024, 18:56 SGT**

## Current Issues

### 1. Redux Store Structure Mismatch
- Two competing slices handling admin view:
  ```typescript
  // adminSlice.ts
  interface AdminState {
    currentView: UserViewType;
    // other fields...
  }

  // adminView.slice.ts
  interface AdminViewState {
    currentView: UserViewType;
  }
  ```
- Causing state management confusion and potential race conditions

### 2. Component Duplication
- Multiple implementations of the same functionality:
  1. `/components/admin/AdminViewToggle.tsx`
  2. `/components/admin/redux/AdminViewToggle.redux.tsx`
  3. `/components/admin/ViewSelector.tsx`

### 3. State Management Issues
- Redux state shows:
  ```javascript
  adminView: {
    currentView: 'regular'
  }
  ```
- Component reads from:
  ```javascript
  admin: {
    currentView: undefined
  }
  ```
- Leading to undefined errors and incorrect state updates

## Files Requiring Updates

### Core Files to Remove
1. `src/components/admin/AdminViewToggle.tsx`
2. `src/components/admin/redux/AdminViewToggle.redux.tsx`
3. `src/components/admin/ViewSelector.tsx`

### Redux Store Files to Update
1. `src/store/slices/adminSlice.ts`
   - Remove currentView state
   - Remove related actions and reducers
   
2. `src/store/slices/adminView.slice.ts`
   - Remove entire file
   
3. `src/store/index.ts`
   - Remove adminView reducer
   - Update RootState type

### Components Using currentView
1. `src/components/Footer.tsx`
   - Remove currentView dependency
   - Update conditional rendering

### Type Definitions
- Remove UserViewType
- Update dependent interfaces

## Impact Analysis

### Breaking Changes
1. UI Features Affected:
   - Footer component's admin view indicator
   - View switching functionality
   - Admin testing capabilities

2. State Management:
   - Redux store structure
   - Admin state handling
   - View type management

### Dependencies
1. Direct Dependencies:
   - Redux store
   - React Router
   - Admin components

2. Indirect Dependencies:
   - Auth flow
   - Route protection
   - Admin permissions

## Fix Plan

### Phase 1: Preparation
1. Create backup of current implementation
2. Document all usage points
3. Notify team of upcoming changes

### Phase 2: Redux Store Cleanup
1. Consolidate admin state management
2. Remove duplicate slices
3. Update type definitions

### Phase 3: Component Updates
1. Remove deprecated components
2. Update dependent components
3. Fix routing issues

### Phase 4: Testing
1. Verify admin functionality
2. Check route protection
3. Test user permissions
4. Validate UI rendering

## Verification Steps
1. Build completes without errors
2. No undefined errors in console
3. Admin features work correctly
4. Routes protected properly
5. UI renders consistently

## Prevention Measures
1. Maintain single source of truth for state
2. Document component dependencies
3. Use TypeScript strictly
4. Follow established patterns

## Notes
- Consider impact on admin testing workflow
- Plan migration path for admin users
- Document new admin testing procedures
- Update related documentation

## References
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)
- [React Router Protection](https://reactrouter.com/docs/en/v6/examples/auth)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
