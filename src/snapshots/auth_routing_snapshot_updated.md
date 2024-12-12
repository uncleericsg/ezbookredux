# Authentication and Routing System Snapshot (Updated)
> Created: 2024-12-11 19:53:54

## Additional Important Components

### 1. User Context Hierarchy
```typescript
// Three-layer user context system:

1. BasicUserContext
Interface:
{
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
Features:
- Basic authentication
- Local storage persistence
- Error handling
- Loading states

2. CombinedUserContext
Interface:
{
  // Basic auth features
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Advanced features
  isAuthenticated: boolean;
  userDispatch: React.Dispatch<UserAction>;
  bookings: Booking[];
}
Features:
- Combines basic and advanced features
- Booking management
- User state updates
- Authentication status

3. UserContext (Main)
Features:
- Role-based access control
- Tech status management
- Booking management
- Profile updates
```

### 2. Local Storage Implementation
```typescript
// Current local storage structure:
{
  'userData': {
    id: string;
    email: string;
    role: 'admin' | 'amc' | 'regular';
    amcStatus?: 'active' | 'inactive';
    firstName: string;
    lastName: string;
    phone: string;
  }
}

// Authentication check on mount:
useEffect(() => {
  const checkAuth = async () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  };
}, []);
```

### 3. Error Handling Structure
```typescript
Error States:
- Authentication errors
- OTP validation errors
- Network errors
- Storage errors

Error Handling Flow:
1. Service level: Try-catch in auth services
2. Context level: Error state management
3. Component level: Error display and user feedback
4. Global level: Toast notifications
```

### 4. User Types and Roles
```typescript
User Types:
1. Regular User
   - Basic booking access
   - Profile management
   - Booking history

2. AMC User
   - All regular user features
   - AMC specific features
   - Subscription management

3. Admin User
   - Full system access
   - User management
   - System configuration

4. Tech User
   - Service management
   - Availability updates
   - Job assignments
```

### 5. Authentication Flow States
```typescript
States to Track:
1. Initial Load
   - loading: true
   - user: null
   - error: null

2. Authentication Success
   - loading: false
   - user: UserData
   - error: null

3. Authentication Failure
   - loading: false
   - user: null
   - error: ErrorMessage

4. OTP States
   - otpSent: boolean
   - otpVerified: boolean
   - otpError: string | null
```

### 6. Route Guards and Protection
```typescript
Protection Levels:
1. Public Routes
   - No authentication required
   - Accessible to all users
   - Includes login and public pages

2. Protected Routes
   - Requires authentication
   - Role-based access
   - Redirect to login if unauthorized

3. Special Routes
   - Requires specific roles
   - Additional validation
   - Custom access rules
```

## Migration Considerations

### 1. Firebase Migration
```typescript
Required Changes:
1. Auth Service Updates
   - Implement Firebase Auth
   - OTP verification
   - User session management

2. User Data Structure
   - Align with Firebase User model
   - Add Firebase UID
   - Handle additional Firebase fields

3. Context Updates
   - Update auth methods
   - Add Firebase specific states
   - Handle Firebase events
```

### 2. Data Persistence
```typescript
Current:
- Local storage based
- Simple JSON structure
- Basic error handling

Needed:
- Firebase Realtime Database/Firestore
- Proper data synchronization
- Offline capabilities
- Better error handling
```

### 3. Security Implementations
```typescript
Required:
1. Rate Limiting
   - OTP requests
   - Login attempts
   - API calls

2. Data Validation
   - Input sanitization
   - Phone number validation
   - OTP validation

3. Session Management
   - Token handling
   - Session timeouts
   - Refresh mechanisms
```

This updated snapshot includes additional critical components and considerations for the authentication and routing system. It provides a more complete picture of the current implementation and what needs to be considered for the Firebase OTP integration.
