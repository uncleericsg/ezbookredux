# Redux State Analysis

> **Note**: This document analyzes the Redux state structure. For component implementations see [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md), and for data flow patterns see [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md).

## 1. Core State Structure

### Auth State (from AuthContext)
> See [Authentication Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#authentication-flow)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

// Key Selectors
const selectUser = (state: RootState) => state.auth.user;
const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
const selectAuthError = (state: RootState) => state.auth.error;

// Key Actions
const authActions = {
  login: createAsyncThunk('auth/login', async (credentials) => {
    // Implementation from AuthContext
  }),
  logout: createAsyncThunk('auth/logout', async () => {
    // Implementation from AuthContext
  }),
  clearError: createAction('auth/clearError')
};
```

### User State (from UserContexts)
> See [User Management Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#user-management-flow)
```typescript
interface UserState {
  profile: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone: string;
    // Optional fields from UserContext
    address?: string;
    amcStatus?: string;
    unitNumber?: string;
    teamId?: string;
    specializations?: string[];
    availability?: {
      status: 'available' | 'busy' | 'offline';
      lastUpdated: string;
    };
  } | null;
  bookings: Booking[];
  error: string | null;
  loading: boolean;
}

// Key Selectors
const selectProfile = (state: RootState) => state.user.profile;
const selectBookings = (state: RootState) => state.user.bookings;
const selectUserError = (state: RootState) => state.user.error;

// Key Actions
const userActions = {
  updateProfile: createAsyncThunk('user/updateProfile', async (data) => {
    // Implementation from UserContext
  }),
  fetchBookings: createAsyncThunk('user/fetchBookings', async () => {
    // Implementation from UserContext
  }),
  addBooking: createAction<Booking>('user/addBooking')
};
```

### Admin State (from AdminViewContext)
> See [Admin Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#admin-flow)
```typescript
interface AdminState {
  currentView: UserViewType;
  isAdmin: boolean;
  adminView: boolean;
  error: string | null;
  loading: boolean;
}

// Key Selectors
const selectCurrentView = (state: RootState) => state.admin.currentView;
const selectIsAdmin = (state: RootState) => state.admin.isAdmin;
const selectAdminView = (state: RootState) => state.admin.adminView;

// Key Actions
const adminActions = {
  setCurrentView: createAction<UserViewType>('admin/setCurrentView'),
  toggleAdminView: createAction('admin/toggleAdminView'),
  resetView: createAction('admin/resetView')
};
```

## 2. State Dependencies

### Auth Dependencies
```typescript
// Components that need auth state
> See [Auth Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#auth-components)
- LoginForm: { user, error, loading }
- Navbar: { user, isAuthenticated }
- ProtectedRoute: { isAuthenticated }
```

### User Dependencies
```typescript
// Components that need user state
> See [User Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#user-components)
- UserProfile: { profile, error }
- BookingForm: { profile, error }
- BookingList: { bookings, loading }
```

### Admin Dependencies
```typescript
// Components that need admin state
> See [Admin Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#admin-components)
- AdminDashboard: { currentView, isAdmin }
- UserManagement: { adminView, loading }
```

## 3. Redux Store Configuration

### Store Setup
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { authReducer, userReducer, adminReducer } from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    admin: adminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'user/updateProfile/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Persistence Configuration
```typescript
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'admin']
};
```

## 4. Migration Notes

### State Transitions
- Auth state transitions from AuthContext
- User state combines BasicUserContext and UserContext
- Admin state from AdminViewContext
> See [REDUX_MIGRATION_PLAN.md](./REDUX_MIGRATION_PLAN.md) for detailed steps

### Data Flow Changes
- Replace context dispatch with Redux dispatch
- Update selectors in components
- Maintain existing patterns
> See [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md) for pattern details

### Component Updates
- Update hooks usage
- Replace context consumers
- Keep error handling
> See [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md) for component changes

---
Last Updated: 2024-12-22
See also:
- [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md) for component implementations
- [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md) for data flow patterns
- [REDUX_MIGRATION_PLAN.md](./REDUX_MIGRATION_PLAN.md) for migration steps
