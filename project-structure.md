# Project Structure Documentation

## Core Application Structure

### Entry Points
- `src/main.tsx`: Application entry point
  - Sets up providers:
    - Redux store provider
    - React Query client provider
    - Error Boundary with development mode support
    - PersistGate for state persistence
  - Initializes router and analytics
  - Configures React Query client with optimized settings
  - Handles global error cases with custom fallback UI

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

## Database Integration

### Prisma ORM
- `prisma/`
  - `schema.prisma`: Database schema definition
  - Models for users, bookings, services, and AMC packages

### Supabase Integration
- `supabase/`
  - `config.toml`: Supabase configuration
  - `migrations/`: Database migrations

### Migrations
- `migrations/`
  - SQL migration files for schema changes
  - Migration metadata and journals
  - Service and payment table migrations

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
  - Loading states
  - Error Boundary System:
    - `error-boundary/`
      - `ErrorBoundary.tsx`: Core error boundary component
      - `ErrorFallback.tsx`: Default error UI
      - `index.ts`: Public API exports
      - `fallbacks/`: Specialized error UIs
        - `SectionErrorFallback.tsx`: Section-specific errors
      - `LocationOptimizerError.tsx`: Location service errors

### Feature Components
- Organized by domain/feature
  - Booking flow components:
    - Protected by error boundaries with location-specific error handling
    - Optimized location provider with dedicated error UI
  - Home page components:
    - Section-based error boundaries for isolated error handling
    - Lazy-loaded sections with fallback UI
  - User profile components:
    - Form-specific error handling
    - Data validation error displays
  - Notification system:
    - Template editor with error protection
    - Real-time update error handling
  - Admin management components:
    - Protected routes with error boundaries
    - Data management error handling
  - AMC management components:
    - AMCManagement.tsx
    - AMCPackageCard.tsx
    - AMCRenewal.tsx
    - AMCRenewalModal.tsx
    - AMCSignup.tsx
    - AMCStatusCard.tsx

## Server Structure

### API Server
- `server/`
  - Express.js server configuration
  - API route handlers
  - Middleware implementations
  - Integration with Stripe for payments

## Configuration Files

### Build Configuration
- `vite.config.ts`: Vite build configuration
- `tsconfig.*.json`: TypeScript configurations
  - Base configuration
  - App-specific config
  - Test config
  - Node config
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `eslint.config.js`: ESLint configuration

### Environment Configuration
- `.env`: Environment variables
- `.env.example`: Environment variable template
- `.cascade-config.json`: Project-specific configurations

## Development Tools

### Testing
- `vitest.config.ts`: Test configuration
- Type tests in `src/store/types/__tests__/`
- Integration tests for components

### Scripts
- Various utility scripts in `scripts/` directory
  - State analysis
  - Backup creation
  - Code fixes and migrations
  - Migration tools:
    - Component categorization
    - Dependency analysis
    - Import verification
    - Route analysis
    - Path updates

## Documentation

### Project Documentation
- `docs/`: Contains project documentation
  - Integration plans
  - Setup references
  - Service categorization
  - Deployment guides
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
  - Payment method logos
  - Manifest files
  - Service worker for PWA support

### Certificates
- SSL certificates for local development
- Production certificates

## Tools
- `tools/`: Contains utility executables
  - Stripe CLI tool
  - Search utilities
