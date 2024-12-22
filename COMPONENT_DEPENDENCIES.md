# Component Dependencies

> **Note**: This document focuses on UI components and their dependencies. For detailed state management and data flow patterns, see [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md).

## 1. Components to Migrate

### Auth Components
- LoginForm
  - Uses: AuthContext
  - Needs: login, error handling
  - See: [Authentication Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#authentication-flow)
- Navbar
  - Uses: AuthContext
  - Needs: user info, logout
  - See: [User Interface in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#state--interface)
- ProtectedRoute
  - Uses: AuthContext
  - Needs: isAuthenticated check

### User Components
- UserProfile
  - Uses: UserContext
  - Needs: profile data, update function
  - See: [User Management Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#user-management-flow)
- BookingForm
  - Uses: UserContext
  - Needs: user data, create booking
- BookingList
  - Uses: UserContext
  - Needs: bookings list, user info

### Admin Components
- AdminDashboard
  - Uses: AdminContext
  - Needs: admin status, view toggle
  - See: [Admin Flow in DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md#admin-flow)
- UserManagement
  - Uses: AdminContext
  - Needs: user list, admin actions

## 2. Migration Pattern

### Basic Pattern
```typescript
// Before (with Context)
const { user, login } = useAuth();

// After (with Redux)
const user = useSelector(selectUser);
const dispatch = useDispatch();
const handleLogin = () => dispatch(login(credentials));
```

### Error Handling
```typescript
// Simple error handling
try {
  await dispatch(someAction());
} catch (error) {
  setError(error.message);
}
```

## 3. Component Updates
> For detailed state management patterns for each component, refer to [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md)

### Auth Components
```typescript
// LoginForm example
const LoginForm = () => {
  const dispatch = useDispatch();
  const { error } = useSelector(selectAuth);
  
  const handleSubmit = (credentials) => {
    dispatch(login(credentials));
  };
};
```

### User Components
```typescript
// UserProfile example
const UserProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  
  const handleUpdate = (data) => {
    dispatch(updateProfile(data));
  };
};
```

### Admin Components
```typescript
// AdminDashboard example
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { isAdmin, adminView } = useSelector(selectAdmin);
  
  const toggleView = () => {
    dispatch(toggleAdminView());
  };
};
```

## 4. Testing Each Component

### Basic Tests
```typescript
test('component renders', () => {
  render(<Component />);
  expect(screen.getByText('Title')).toBeInTheDocument();
});

test('handles user interaction', () => {
  render(<Component />);
  fireEvent.click(button);
  expect(mockDispatch).toHaveBeenCalled();
});
```

---
Last Updated: 2024-12-22
See also: 
- [DATA_FLOW_PATTERNS.md](./DATA_FLOW_PATTERNS.md) for state management details
- [REDUX_MIGRATION_PLAN.md](./REDUX_MIGRATION_PLAN.md) for overall migration strategy
