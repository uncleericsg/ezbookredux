# Login Component Code Split Plan

## Current Issues
- Large monolithic component (350+ lines)
- Mixed concerns (auth logic, UI, animations, video background)
- Complex state management
- Repeated styling patterns
- Multiple responsibilities
- Complex authentication flows
- Route-specific handling

## Split Strategy

### 1. Core Components

#### `LoginPage.tsx`
- Main container component
- Handles layout and composition
- Minimal direct logic
- Imports and composes other components
- Maintains PublicRoute integration
- Handles authentication state checks

#### `VideoBackground.tsx`
- Handles video background logic
- Loading states
- Error handling
- Fallback UI
- Performance optimizations
- Mobile optimization

### 2. Feature Components

#### `FirstTimeCustomerPanel.tsx`
- Left panel (60% width)
- Action buttons
- Marketing content
- Navigation logic
- Animation states

#### `ExistingCustomerPanel.tsx`
- Right panel (40% width)
- Login form
- OTP handling
- Form validation
- Error states
- Loading states

### 3. Logic and Hooks

#### `useAuth.ts`
- Authentication state management
- Token handling
- User data management
- Navigation after auth
- PublicRoute integration
- Authentication state checks
- Intended path handling

#### `useOtpVerification.ts`
- OTP state management
- Verification logic
- Error handling
- Rate limiting
- Input validation

#### `useReturnUrl.ts`
- Return URL management
- Booking data handling
- Session storage logic
- Navigation state

#### `useVideoBackground.ts`
- Video loading state
- Error handling
- Performance optimization
- Mobile detection

### 4. UI Components

#### `WelcomeHeader.tsx`
- Logo
- Welcome text
- Animations
- Responsive design

#### `OtpInput.tsx`
- OTP input field
- Auto-verification
- Input validation
- Error states
- Loading states

#### `ActionButton.tsx`
- Reusable button component
- Animation states
- Loading states
- Variant support

### 5. Types and Constants

#### `types/auth.ts`
```typescript
export interface UserData {
  id: string;
  phone: string;
  role: 'regular' | 'admin';
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bookings: any[];
  notifications: any[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export interface PublicRouteState {
  isFullyAuthenticated: boolean;
  currentUser: UserData | null;
  intendedPath: string;
}
```

#### `constants/auth.ts`
```typescript
export const AUTH_CONSTANTS = {
  TEST_MOBILE: '91874498',
  TEST_OTP: '123456',
  TOKEN_KEY: 'auth_token',
  USER_DATA_KEY: 'user_data',
  PENDING_BOOKING_KEY: 'pendingBooking'
};

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  BOOKING: {
    PRICE_SELECTION: '/booking/price-selection'
  },
  AMC: {
    SIGNUP: '/amc/signup'
  }
};

export const ASSETS = {
  VIDEO_BG: 'videos/bokeh_video_bg.webm',
  LOGO: '/logo.png'
};
```

#### `styles/common.ts`
```typescript
export const COMMON_STYLES = {
  containers: {
    root: 'min-h-screen w-full relative',
    panel: 'bg-gray-800/50 border-gray-700/70 rounded-xl backdrop-blur-sm',
    content: 'grid-cols-1 md:grid-cols-5 gap-6'
  },
  buttons: {
    base: 'w-full flex justify-center py-2 px-4 rounded-md',
    primary: 'bg-[#FFD700] hover:bg-yellow-500',
    gradient: 'bg-gradient-to-r'
  },
  forms: {
    container: 'w-full space-y-4',
    input: 'bg-gray-700 border-gray-600 text-white'
  }
};
```

## Implementation Steps

1. Create directory structure:
```
src/
  components/
    auth/
      LoginPage/
        index.tsx
        components/
          VideoBackground/
            index.tsx
            useVideoBackground.ts
            VideoFallback.tsx
          FirstTimeCustomerPanel/
            index.tsx
            ActionButtons.tsx
          ExistingCustomerPanel/
            index.tsx
            LoginForm.tsx
            OtpSection.tsx
          WelcomeHeader/
            index.tsx
          common/
            OtpInput.tsx
            ActionButton.tsx
        hooks/
          useAuth.ts
          useOtpVerification.ts
          useReturnUrl.ts
        types/
          auth.ts
        constants/
          index.ts
        styles/
          common.ts
```

2. Extract components in order:
   - Start with UI components (ActionButton, OtpInput)
   - Move to feature components (VideoBackground, Panels)
   - Extract hooks (useAuth, useOtpVerification)
   - Update imports and exports
   - Verify PublicRoute integration

3. Update router configuration:
   - Update import path
   - Verify PublicRoute wrapper
   - Maintain eager loading
   - Update route constants

4. Testing Strategy:
   - Unit Tests:
     * Individual hooks
     * UI components
     * Utility functions
     * Authentication flows
   - Integration Tests:
     * Form submission
     * Authentication process
     * Navigation behavior
     * PublicRoute integration
   - Visual Tests:
     * Component snapshots
     * Responsive design
     * Animation states
     * Video background

5. Build Configuration:
   - Update path aliases
   - Configure asset handling
   - Set up environment variables
   - Optimize bundle splitting

## Migration Plan

1. Phase 1: Core Structure
   - Set up directory structure
   - Create empty components
   - Add types and constants

2. Phase 2: UI Components
   - Implement common components
   - Add styling system
   - Set up animations

3. Phase 3: Feature Components
   - Build video background
   - Create panels
   - Implement forms

4. Phase 4: Logic
   - Extract hooks
   - Set up authentication
   - Add navigation

5. Phase 5: Integration
   - Connect components
   - Add PublicRoute
   - Test flows

6. Phase 6: Optimization
   - Performance improvements
   - Bundle optimization
   - Asset optimization

## Rollback Plan

1. Keep old component until fully migrated
2. Maintain feature parity
3. Use feature flags if needed
4. Monitor for issues
5. Keep backup of original code
6. Version control checkpoints

## Success Criteria

1. Functionality
   - All existing features work
   - Authentication flows maintained
   - Navigation behaves correctly
   - Forms validate properly

2. Performance
   - Video loads efficiently
   - Animations are smooth
   - Bundle size is optimized
   - Load times are acceptable

3. User Experience
   - No visual regressions
   - Responsive design works
   - Error handling is clear
   - Loading states are smooth

4. Code Quality
   - Clear component boundaries
   - Proper type safety
   - Consistent styling
   - Good test coverage