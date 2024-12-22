# Data Flow Patterns - Detailed Context Analysis

> **Note**: This document focuses on state management and data flow patterns. For component-specific implementations and UI dependencies, see [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md).

## 1. Authentication Flow (AuthContext.tsx)
> See [Auth Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#auth-components) for component implementations

### State & Interface
```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'amc' | 'regular';
  amcStatus?: 'active' | 'inactive';
  firstName: string;
  lastName: string;
  phone: string;
  // Optional fields
  address?: string;
  condoName?: string;
  lobbyTower?: string;
  unitNumber?: string;
  createdAt: string;
  updatedAt: string;
  bookings?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

### Key Features
- Local storage persistence (AUTH_USER_KEY)
- Navigation after logout
- Error handling
- Loading states

## 2. User Management Flow
> See [User Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#user-components) for component implementations

### BasicUserContext.tsx
```typescript
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Features
- Basic authentication
- Local storage sync
- Error handling
- Loading states
```

### UserContext.tsx
```typescript
interface User {
  // Extended user fields
  teamId?: string;
  specializations?: string[];
  availability?: {
    status: 'available' | 'busy' | 'offline';
    lastUpdated: string;
  };
}

// Features
- Redux integration
- Toast notifications
- Role-based access
- Technician specific fields
```

### CombinedUserContext.tsx
```typescript
type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Features
- Advanced state management (useReducer)
- Booking management
- User updates
- Migration support
```

## 3. Admin Flow (AdminViewContext.tsx)
> See [Admin Components in COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#admin-components) for component implementations

### Interface
```typescript
interface AdminViewContextType {
  currentView: UserViewType;
  setCurrentView: (view: UserViewType) => void;
  isFeatureVisible: (feature: string) => boolean;
  resetView: () => void;
}
```

### Key Features
- View persistence in localStorage
- Role-based view switching
- Feature visibility control
- Redux integration
- View reset functionality

## 4. Data Flow Patterns
> For component-level implementation of these patterns, see [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#migration-pattern)

### Authentication Flow
```typescript
// Login
const handleLogin = async (credentials) => {
  try {
    setLoading(true);
    const userData = await authenticateUser(credentials);
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    setError(error.message);
    return false;
  } finally {
    setLoading(false);
  }
};

// Logout
const handleLogout = async () => {
  localStorage.removeItem('userData');
  setUser(null);
  navigate('/login');
};
```

### User Data Flow
```typescript
// Update User
const handleUserUpdate = async (data) => {
  userDispatch({ type: 'UPDATE_USER', payload: data });
  // Sync with local storage
  localStorage.setItem('userData', JSON.stringify({
    ...user,
    ...data
  }));
};

// Add Booking
const handleBooking = (booking) => {
  userDispatch({ type: 'ADD_BOOKING', payload: booking });
};
```

### Admin View Flow
```typescript
// Toggle View
const handleViewChange = (view: UserViewType) => {
  setCurrentView(view);
  localStorage.setItem('currentView', view);
};

// Check Feature Visibility
const isFeatureVisible = (feature: string) => {
  const userRole = user?.role || 'non-user';
  return getFeaturePermissions(userRole, feature);
};
```

## 5. Migration Considerations
> See [REDUX_MIGRATION_PLAN.md](./REDUX_MIGRATION_PLAN.md) for the complete migration strategy

### State Management
- Move from Context to Redux slices
- Maintain action patterns
- Keep error handling
- Preserve loading states

### Data Persistence
- Keep localStorage sync
- Maintain state shape
- Preserve error handling
- Keep loading indicators

### View Management
- Maintain role-based views
- Keep feature visibility
- Preserve view persistence
- Handle view resets

## 6. Common Patterns to Preserve
> For component-level implementation of these patterns, see [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md#component-updates)

### Error Handling
```typescript
try {
  await operation();
  clearError();
} catch (error) {
  setError(error.message);
  toast.error(error.message);
}
```

### Loading States
```typescript
const handleOperation = async () => {
  setLoading(true);
  try {
    await operation();
  } finally {
    setLoading(false);
  }
};
```

### Local Storage Sync
```typescript
// Save
localStorage.setItem('key', JSON.stringify(data));

// Load
const data = JSON.parse(localStorage.getItem('key') || 'null');
```

### Role-Based Logic
```typescript
const checkPermission = (role: UserRole, feature: string) => {
  switch (role) {
    case 'admin':
      return true;
    case 'amc':
      return AMC_FEATURES.includes(feature);
    default:
      return BASIC_FEATURES.includes(feature);
  }
};
```

---
Last Updated: 2024-12-22
See also:
- [COMPONENT_DEPENDENCIES.md](./COMPONENT_DEPENDENCIES.md) for component implementations
- [REDUX_MIGRATION_PLAN.md](./REDUX_MIGRATION_PLAN.md) for overall migration strategy
- [REDUX_STATE_ANALYSIS.md](./REDUX_STATE_ANALYSIS.md) for Redux state structure
