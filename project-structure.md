# Project Structure Documentation

## Core Application Structure

### Entry Points
- `src/main.tsx`: Application entry point
  - Sets up providers (Redux, React Query, Error Boundary)
  - Initializes router and analytics
  - Configures React Query client

### Application Root
- `src/App.tsx`: Root component
  - Provides Redux store
  - Renders router outlet

## State Management

### Store Configuration
- `src/store/`
  - `index.ts`: Main store configuration
    - Exports typed hooks (useAppSelector, useAppDispatch)
    - Provides resetStore action
  - `rootReducer.ts`: Combined reducer
    - Handles store reset functionality
    - Combines all feature slices

### Feature Slices
- `src/store/slices/`
  - `adminSlice.ts`: Admin-related state
  - `authSlice.ts`: Authentication state
  - `bookingSlice.ts`: Booking management
  - `serviceSlice.ts`: Service-related state
  - `technicianSlice.ts`: Technician management
  - `userSlice.ts`: User profile state

## Routing System

### Main Router
- `src/router.tsx`: Application routing
  - Public routes (login, pricing)
  - Protected routes (profile, booking confirmation)
  - Admin routes (dashboard, bookings, users, services, settings)
  - Development-only routes (test routes, mockups)

### Route Configuration
- Uses React Router v6
- ProtectedRoute and PublicRoute components for access control
- Layout management for consistent UI structure
- Route organization:
  - Root path (`/`) renders ServiceCategorySelection component
  - Booking routes:
    - `/booking/return-customer`: Return customer booking flow
    - `/booking/powerjet-chemical-wash`: PowerJet Chemical Wash booking
    - `/booking/first-time`: First-time customer booking flow
    - `/booking/confirmation`: Booking confirmation page
  - Pricing routes:
    - `/pricing`: Service pricing selection
    - `/amc/signup`: AMC signup page
  - User routes:
    - `/profile`: User profile management
    - `/notifications`: User notifications
  - Admin routes:
    - `/admin/dashboard`: Admin dashboard
    - `/admin/bookings`: Booking management
    - `/admin/users`: User management
    - `/admin/services`: Service management
    - `/admin/settings`: System settings

### Route Protection
- PublicRoute: Used for routes accessible to all users (login, pricing)
- ProtectedRoute: Used for authenticated user routes
- AdminRoute: Used for admin-only routes (extends ProtectedRoute)

### Layout Management
- Layout component wraps main application routes
- Routes can opt-out of layout using direct Route definition
- Consistent header/footer across layout routes

## Component Organization

### Core Components
- `src/components/`
  - Layout components
  - Common UI elements
  - Error handling components
  - Loading states

### Feature Components
- Organized by domain/feature
  - Booking flow components
  - User profile components
  - Notification system
  - Admin management components

## Configuration Files

### Build Configuration
- `vite.config.ts`: Vite build configuration
- `tsconfig.*.json`: TypeScript configurations
- `tailwind.config.ts`: Tailwind CSS configuration

### Environment Configuration
- `.env`: Environment variables
- `.env.example`: Environment variable template

## Development Tools

### Testing
- `vitest.config.ts`: Test configuration
- Type tests in `src/store/types/__tests__/`

### Scripts
- Various utility scripts in `scripts/` directory
  - State analysis
  - Backup creation
  - Code fixes and migrations

## Documentation

### Project Documentation
- `docs/`: Contains project documentation
  - Integration plans
  - Setup references
  - Archived documentation

### Code Documentation
- Extensive JSDoc comments throughout codebase
- Type safety with TypeScript
- Clear component and hook documentation

## Public Assets

### Static Files
- `public/`: Contains static assets
  - Images
  - Fonts
  - Icons
  - Manifest files

### Certificates
- SSL certificates for local development
