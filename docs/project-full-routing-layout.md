# iAircon EasyBooking - Routing Architecture Documentation

## Overview
This document provides a comprehensive overview of the routing architecture implemented in the iAircon EasyBooking application. The routing system is built using React Router v7 with a focus on security, performance, and user experience.

## Route Categories

### 1. Layout-Wrapped Routes
Routes that include the main application layout wrapper (`<Layout />` component):

- `/` - Home/Service Category Selection
- `/notifications` - User Notifications
- `/profile` - User Profile
- `/booking/confirmation/:bookingId` - Booking Confirmation

These routes share common UI elements like navigation, header, and footer.

### 2. Self-Contained Routes
Routes that operate without the main layout:

#### Authentication
- `/login` - User Login

#### Booking Flows
- `/booking/first-time` - First Time Customer Booking
- `/booking/return-customer` - Return Customer Booking
- `/booking/price-selection` - Service Price Selection
- `/booking/powerjet-chemical-wash` - PowerJet Chemical Wash Service
- `/booking/gas-check-leak` - Gas Leak Check Service

#### AMC (Annual Maintenance Contract)
- `/amc/signup` - AMC Registration
- `/amc/packages` - AMC Package Selection
- `/amc/subscription-flow` - AMC Subscription Process

### 3. Admin Routes
Protected routes for administrative functions:

- `/admin/dashboard` - Admin Overview
- `/admin/users` - User Management
- `/admin/services` - Service Management
- `/admin/teams` - Team Management
- `/admin/notifications` - Notification Management
- `/admin/homepage` - Homepage Configuration
- `/admin/amc` - AMC Management
- `/admin/analytics` - Analytics Dashboard
- `/admin/branding` - Branding Settings
- `/admin/push` - Push Notification Settings
- `/admin/settings` - System Settings

## Protection Levels

### 1. Public Routes
Accessible without authentication:
- Home (/)
- Login (/login)
- First Time Booking Flow
- Price Selection
- PowerJet Chemical Wash
- Gas Leak Check

### 2. Protected Routes
Require user authentication:
```typescript
const PROTECTED_ROUTES = [
  // Admin Routes
  '/admin/*',
  // User Routes
  '/profile',
  '/dashboard',
  '/notifications',
  // Booking Routes
  '/booking/confirmation/:bookingId',
  '/booking/new'
];
```

### 3. Role-Protected Routes
Routes with specific role requirements:

```typescript
const ROLE_PROTECTED_ROUTES = {
  ADMIN: ['/admin/*'],
  TECH: ['/tech'],
  AMC: ['/amc/dashboard']
};
```

## Navigation Structure

### Routes Without Navigation Bar
The following routes operate without the main navigation bar for a focused user experience:

1. Authentication
   - Login

2. First Time Customer Flow
   - First Time Booking
   - Price Selection
   - PowerJet Chemical Wash
   - Gas Leak Check

3. AMC Flow
   - Signup
   - Subscription

4. Admin Section
   - All admin routes operate with their own navigation system

## Route Metadata
Each route contains metadata for consistent UI presentation:

```typescript
const ROUTE_METADATA = {
  '/': {
    title: 'Home',
    breadcrumb: 'Home'
  },
  '/login': {
    title: 'Login',
    breadcrumb: 'Login'
  }
  // ... additional routes
};
```

## Code Splitting Strategy

### 1. Eager Loading
Core components that are essential for initial render:
- Layout
- LoadingScreen
- Login
- NotFound
- ProtectedRoute
- PublicRoute
- ServiceCategorySelection

### 2. Lazy Loading
Components that benefit from code splitting:

```typescript
// Admin Components
const AdminDashboard = lazy(() => import('@admin/AdminDashboard'));
const AdminSettings = lazy(() => import('@admin/AdminSettings'));
const ServiceHub = lazy(() => import('@admin/ServiceHub/ServiceHub'));
const UserManagement = lazy(() => import('@admin/UserManagement'));

// Booking Components
const AMCSignup = lazy(() => import('@components/AMCSignup'));
const PowerJetChemWashHome = lazy(() => import('@booking/PowerJetChemWashHome'));
const BookingConfirmation = lazy(() => import('@booking/BookingConfirmation'));
const FirstTimeBookingFlowWrapper = lazy(() => import('@booking/FirstTimeBookingFlowWrapper'));
```

## Error Handling
- Each route is wrapped with error boundary components
- Fallback UI for loading states using Suspense
- Route logging for debugging purposes

## Performance Considerations

1. Route-based Code Splitting
   - Components are loaded on demand
   - Suspense boundaries for smooth loading states

2. Protected Route Implementation
   - Authentication checks before component loading
   - Role-based access control

3. Layout Optimization
   - Separate layouts for different sections
   - Minimal re-renders through proper component structure

## Navigation Patterns

### 1. Main Application Flow
- Service selection → Booking flow → Confirmation
- Protected user areas (profile, notifications)

### 2. Administrative Flow
- Dashboard-centric navigation
- Dedicated admin layout
- Quick access to key management functions

### 3. Booking Flows
- First-time customer journey
- Return customer optimized path
- Service-specific routes

## Route Guards and Protection

### 1. Authentication Guard
```typescript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

### 2. Role Guard
```typescript
<ProtectedRoute requiresAdmin>
  <AdminComponent />
</ProtectedRoute>
```

### 3. Public Route Guard
```typescript
<PublicRoute>
  <LoginComponent />
</PublicRoute>
```

## Best Practices

1. Route Definition
   - Centralized route configuration
   - Consistent naming conventions
   - Type-safe route constants

2. Protection Layers
   - Multiple levels of route protection
   - Role-based access control
   - Public route handling

3. Code Organization
   - Feature-based routing
   - Lazy loading for optimization
   - Clear separation of concerns

4. Error Handling
   - Comprehensive error boundaries
   - Fallback UI components
   - Debug-friendly route logging

## Conclusion
The routing architecture of iAircon EasyBooking is designed to provide a secure, performant, and maintainable system. It effectively handles different user roles, protects sensitive routes, and optimizes the loading of components through code splitting.