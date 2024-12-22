# Redux Migration Plan - Simple and Effective

## Overview
Simple plan to implement Redux in our iAircon EasyBooking web app, focusing on core features and clean implementation.

## 0. Context Files to Migrate

### Authentication
- `src/contexts/AuthContext.tsx`
  - Handles login/logout
  - User authentication state

### User Management
- `src/contexts/BasicUserContext.tsx`
  - Basic user data
- `src/contexts/UserContext.tsx`
  - Extended user features
- `src/contexts/CombinedUserContext.tsx`
  - Combined user management

### Admin Features
- `src/contexts/AdminViewContext.tsx`
  - Admin view toggle
  - Admin-specific features

## 1. Project Setup (Day 1)

### Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux
```

### Basic Folder Structure
```
/src
  /store
    index.ts         # Main store setup
  /slices
    authSlice.ts     # Login/logout
    userSlice.ts     # User data
    adminSlice.ts    # Admin features
```

## 2. Implementation Plan (2 Weeks)

### Week 1: Core Implementation

#### Day 1-2: Redux Setup & Auth
```typescript
// Basic auth slice (replacing AuthContext.tsx)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Main actions
- login
- logout
- clearError
```

#### Day 3-4: User Features
```typescript
// User slice (replacing BasicUserContext.tsx, UserContext.tsx, CombinedUserContext.tsx)
interface UserState {
  userData: User | null;
  bookings: Booking[];
  error: string | null;
}

// Main actions
- updateProfile
- fetchBookings
- createBooking
```

#### Day 5: Admin Features
```typescript
// Admin slice (replacing AdminViewContext.tsx)
interface AdminState {
  isAdmin: boolean;
  adminView: boolean;
}

// Main actions
- toggleAdminView
- manageUsers
```

### Week 2: Testing & Cleanup

#### Day 1-3: Testing Core Features
- Test login/logout
- Test user operations
- Test admin features

#### Day 4-5: Cleanup
- Remove old context files:
  1. AuthContext.tsx
  2. BasicUserContext.tsx
  3. UserContext.tsx
  4. CombinedUserContext.tsx
  5. AdminViewContext.tsx
- Final testing
- Documentation update

## 3. Migration Steps

### Step 1: Auth Migration
1. Create auth slice
2. Move login/logout logic from AuthContext.tsx
3. Update auth components
4. Test auth flow

### Step 2: User Migration
1. Create user slice
2. Move user data from BasicUserContext.tsx and UserContext.tsx
3. Consolidate CombinedUserContext.tsx functionality
4. Update user components
5. Test user features

### Step 3: Admin Migration
1. Create admin slice
2. Move admin features from AdminViewContext.tsx
3. Update admin components
4. Test admin functionality

## 4. Success Checklist

### Auth Features
- [ ] Login works
- [ ] Logout works
- [ ] Auth state persists
- [ ] Protected routes work

### User Features
- [ ] Profile view/edit works
- [ ] Bookings display works
- [ ] User data persists
- [ ] Error handling works

### Admin Features
- [ ] Admin view toggle works
- [ ] User management works
- [ ] Admin controls work

## 5. Simple Testing Plan

### Auth Testing
```typescript
// Example test
test('login success', () => {
  const store = configureStore({ reducer: authReducer });
  store.dispatch(login(credentials));
  expect(store.getState().isAuthenticated).toBe(true);
});
```

### User Testing
```typescript
// Example test
test('update profile', () => {
  const store = configureStore({ reducer: userReducer });
  store.dispatch(updateProfile(userData));
  expect(store.getState().userData).toEqual(userData);
});
```

## 6. Rollback Plan

### Quick Rollback Steps
1. Keep context files until fully tested
2. Can switch back to context if needed
3. Both systems can run parallel

## 7. Timeline Overview
- Week 1: Core Implementation
  - Day 1-2: Redux & Auth
  - Day 3-4: User Features
  - Day 5: Admin Features

- Week 2: Testing & Cleanup
  - Day 1-3: Testing
  - Day 4-5: Cleanup & Docs

## 8. Key Points for Success

### Must-Haves
1. Working auth flow
2. User data persistence
3. Admin functionality
4. Error handling

### Nice-to-Haves
1. Loading states
2. Error messages
3. Form validation

## 9. Daily Checklist

### Development
- [ ] Features working
- [ ] No console errors
- [ ] Basic tests pass

### Testing
- [ ] Login/logout works
- [ ] User features work
- [ ] Admin features work
- [ ] No regressions

## Next Steps
1. Set up Redux store
2. Start with auth slice
3. Test auth flow
4. Continue with user features

---
Last Updated: 2024-12-22
Status: Ready for Implementation
Version: 1.1
