# Redux Migration Guide

This guide outlines the process of migrating from the Context API to Redux Toolkit in our application.

## Overview

We are migrating our state management from React Context to Redux Toolkit to improve:
- State management scalability
- Developer tooling and debugging capabilities
- Performance optimization
- Type safety

## Migration Steps

### 1. Install Dependencies

The following dependencies have been added to the project:
```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Redux Store Structure

The Redux store has been set up with the following slices:
- `userSlice`: Manages user data and authentication state
- `authSlice`: Handles authentication tokens and status
- `paymentSlice`: Manages payment methods and transactions
- `adminSlice`: Handles admin settings and user management

### 3. Migrating Components

#### Step 1: Use the Migration Hook
During the transition period, use the `useUserMigration` hook to ensure both Context and Redux states are synchronized:

```tsx
import { useUserMigration } from '../hooks/useUserMigration';

function YourComponent() {
  useUserMigration(); // Add this line
  // ... rest of your component
}
```

#### Step 2: Replace Context with Redux
Replace the `useUser` hook with the new `useUserRedux` hook:

```tsx
// Before
import { useUser } from '../contexts/UserContext';

function YourComponent() {
  const { user, login, logout } = useUser();
  // ...
}

// After
import { useUserRedux } from '../hooks/useUserRedux';

function YourComponent() {
  const { user, login, logout } = useUserRedux();
  // ...
}
```

### 4. Using Redux Hooks

The following typed hooks are available:
- `useAppDispatch`: Typed dispatch function
- `useAppSelector`: Typed selector function
- `useUserRedux`: Main user management hook

Example usage:
```tsx
import { useAppSelector, useAppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';

function YourComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.currentUser);
  
  // Example dispatch
  const updateUser = (userData) => {
    dispatch(setUser(userData));
  };
}
```

### 5. Testing

When testing components:
1. Wrap your test components with the Redux Provider
2. Use the provided test utilities for Redux
3. Mock the store state as needed

Example:
```tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';

test('your test', () => {
  render(
    <Provider store={store}>
      <YourComponent />
    </Provider>
  );
});
```

## Rollback Plan

If issues arise during migration:
1. The backup script has created timestamped backups of the original code
2. Use the backup manifest file to identify the correct version
3. Restore the backed-up files from the `backups` directory

## Timeline

1. Week 1: Migrate core user management components
2. Week 2: Migrate payment and transaction components
3. Week 3: Migrate admin and settings components
4. Week 4: Testing and bug fixes

## Best Practices

1. Always use typed selectors and actions
2. Keep selectors memoized using `createSelector`
3. Use the Redux DevTools for debugging
4. Follow the Redux Style Guide for consistent code

## Need Help?

If you encounter any issues during migration:
1. Check the Redux DevTools for state issues
2. Review the migration documentation
3. Consult the team lead for assistance
4. Create an issue in the project repository with the "redux-migration" label
