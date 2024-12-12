# Authentication and Routing System Snapshot
> Created: 2024-12-11 19:52:39

This document captures the current state of the authentication and routing system before implementing Firebase OTP authentication.

## 1. Routing Structure
```typescript
Current Routes:
- Public Routes:
  - /login                  // Login page with OTP implementation
  - /test-auth             // Test authentication page
  - /booking/first-time/*  // First-time booking flow
  - /booking/price-selection // Price selection page
  - /amc/packages          // AMC packages page
  - /payment/success       // Payment success page

- Protected Routes (Require Authentication):
  - /admin/*              // All admin routes
  - /profile             // User profile
  - /dashboard           // User dashboard
  - /notifications       // User notifications
  - All admin subroutes:
    - /admin/dashboard
    - /admin/users
    - /admin/services
    - /admin/teams
    - /admin/notifications
    - /admin/homepage
    - /admin/amc
    - /admin/analytics
    - /admin/branding
    - /admin/push
    - /admin/settings

- Main Layout Route:
  - /                    // Home with ServiceCategorySelection
```

## 2. Authentication Context Structure
```typescript
interface User {
  id: string;
  email: string;
  role?: 'admin' | 'regular' | 'tech' | 'amc';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  amcStatus?: string;
  unitNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  bookings?: Booking[];
  // Technician specific fields
  teamId?: string;
  specializations?: string[];
  availability?: {
    status: 'available' | 'busy' | 'offline';
    lastUpdated: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userDispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
```

## 3. Route Protection Implementation
```typescript
// Layout.tsx route protection logic
const Layout: React.FC = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    // Redirect to login if trying to access protected route without authentication
    if (requiresAuth && !loading && !user) {
      navigate('/login', { 
        state: { from: location.pathname } 
      });
    }
  }, [requiresAuth, user, loading, navigate, location]);
}
```

## 4. Current Login Page Features
```typescript
Login Page States:
- email: string                 // Mobile number input
- password: string             // OTP input
- loading: boolean            // Loading state
- showOtpButton: boolean     // Show/hide OTP button
- otpSent: boolean          // OTP sent status

Features:
1. Mobile Number Validation:
   - Must be 8 digits
   - Must start with 8 or 9
   - Shows inline OTP button when valid

2. OTP Flow:
   - Inline "Send OTP" button appears after valid number
   - Shows "OTP Sent" status after sending
   - OTP input field appears after sending
   - Resend OTP option available
   - Verify OTP button for final submission
```

## 5. Context Providers Architecture
```typescript
// App.tsx provider hierarchy
<BasicUserProvider>
  <CombinedUserProvider>
    <UserProvider>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </UserProvider>
  </CombinedUserProvider>
</BasicUserProvider>
```

## 6. Important Implementation Notes

### Authentication Flow
1. User enters mobile number
2. System validates number format (8 digits, starts with 8/9)
3. User receives OTP
4. User enters OTP
5. System verifies OTP
6. On success:
   - Creates/updates user in database
   - Sets authentication state
   - Redirects to intended route

### Route Protection
1. All routes under PROTECTED_ROUTES require authentication
2. Unauthenticated users are redirected to login
3. Original route is stored in location.state.from
4. Successful login redirects back to original route

### Layout Component Rules
1. Must not be nested inside other layouts
2. Used only once as top-level wrapper
3. Handles navbar visibility based on route
4. Manages authentication redirects

### State Management
1. Uses combination of contexts for user state
2. Implements local storage persistence
3. Handles loading states during auth checks
4. Manages user role-based access

## 7. Pending Implementations
1. Firebase OTP integration
2. User role implementation
3. Complete authentication flow with Firebase
4. Error handling for OTP process
5. User session management

## 8. Security Considerations
1. OTP timeout implementation needed
2. Rate limiting for OTP requests required
3. Session management to be implemented
4. Secure storage of user tokens needed

---
This snapshot serves as a reference point for implementing the Firebase OTP authentication system and ensuring proper routing behavior is maintained throughout the application.
