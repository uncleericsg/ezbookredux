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
  - Layout components (`Layout.tsx`, `Navbar.tsx`, `Footer.tsx`)
  - Common UI elements:
    - `Toast.tsx`
    - `TimeSlotPicker.tsx`
    - `LoadingScreen.tsx`
    - `NotificationBadge.tsx`
    - `ScrollToTop.tsx`
    - `ColorPicker.tsx`
  - Service-related components:
    - `ServiceCategorySelection.tsx`
    - `ServicePricingSelection.tsx`
    - `ServiceScheduling.tsx`
    - `ServiceHistory.tsx`
    - `ServiceRating.tsx`
  - PWA components:
    - `AppInstallPrompt.tsx`
    - `PWAInstallPrompt.tsx`
  - Error Boundary System:
    - `error-boundary/`
      - `ErrorBoundary.tsx`
      - `ErrorFallback.tsx`
      - `index.ts`
      - `fallbacks/`

### Feature Components
- Organized by domain/feature
  - `admin/`: Admin dashboard and management
  - `auth/`: Authentication components
  - `booking/`: Booking flow components
  - `common/`: Shared components
  - `dev/`: Development utilities
  - `error-boundary/`: Error handling
  - `home/`: Home page components
  - `icons/`: Icon components
  - `modals/`: Modal components
  - `notifications/`: Notification system
  - `payment/`: Payment components
  - `profile/`: User profile
  - `tech/`: Technician components
  - `test/`: Test components
  - `ui/`: UI components library

### AMC Components
- AMC (Annual Maintenance Contract) management:
  - `AMCManagement.tsx`
  - `AMCPackageCard.tsx`
  - `AMCRenewal.tsx`
  - `AMCRenewalModal.tsx`
  - `AMCSignup.tsx`
  - `AMCStatusCard.tsx`
  - `AMCSubscriptionFlow.tsx`
  - `AMCRenewalWrapper.tsx`

## Server Structure

### API Server
- `server/`
  - Express.js server configuration
  - API route handlers
  - Middleware implementations
  - Integration with Stripe for payments

## Configuration Files

### Build Configuration
- `vite.config.ts`: Vite configuration with plugins
- TypeScript configurations:
  - `tsconfig.json`: Base configuration
  - `tsconfig.app.json`: Application config
  - `tsconfig.node.json`: Node.js config
  - `tsconfig.test.json`: Test config
  - `tsconfig.eslint.json`: ESLint TypeScript config
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `eslint.config.js`: ESLint configuration
- `.prettierrc`: Prettier configuration
- `.lintstagedrc`: Lint-staged configuration

### Project Configuration
- `.env`: Environment variables
- `.env.example`: Environment template
- `.cascade-config.json`: Project settings
- `.cursorrules`: Cursor IDE rules
- `.clinerules`: CLI rules
- `.windsurfrules`: Windsurf rules
- `.husky/`: Git hooks

## Development Tools

### Testing
- `vitest.config.ts`: Test configuration
- Type tests in `src/store/types/__tests__/`
- Integration tests for components
- Comprehensive test reporting system:
  - Performance metrics
  - Coverage analysis
  - Status tracking
  - Trend visualization

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

## Error Handling System

### Core Error Boundary
- `src/components/error-boundary/`
  - Unified error handling implementation
  - Type-safe error boundary components
  - Customizable error UI system
  - Development mode enhancements

### Error Handling Strategy
- Application-wide protection in main.tsx
- Feature-specific error boundaries:
  - Section-based error handling for home page
  - Location service error handling
  - Form submission error handling
  - API error management
- Development tools:
  - Enhanced error details in development
  - Error stack traces
  - Error recovery mechanisms

### Error UI System
- Default error fallback for general errors
- Specialized error UIs:
  - Section-specific error displays
  - Service-specific error handling
  - Form validation error displays
- Error recovery:
  - Retry mechanisms
  - State reset capabilities
  - User feedback system

## Tools
- `tools/`: Contains utility executables
  - Stripe CLI tool
  - Search utilities

## Testing Infrastructure

### Test Organization
- `tests/`: Main test directory
  - `analysis/`: Analysis tools and utilities
    - `core/`: Core analysis functionality
    - `utils/`: Analysis utility functions
    - `types/`: Analysis type definitions
    - `performance/`: Performance analysis tools
  - `reports/`: Test reporting infrastructure
    - `generators/`: Report generation tools
      - `generate-perf-report.ts`
      - `generate-coverage-report.ts`
      - `generate-status-report.ts`
      - `__tests__/`
    - `coverage/`
    - `performance/`
  - `setup/`: Test configuration and utilities
  - `types/`: Test type definitions
  - `frontend/`: Component tests
  - `integration/`: Integration tests
  - `backend/`: API and service tests

### Test Configuration
- `vitest.config.ts`: Vitest configuration
- Path aliases for test organization
- Specialized test utilities and matchers

### Test Utilities
- Test setup helpers in `tests/setup/`
- Mock data generators
- Test type definitions
- Custom test matchers

### Report Generation
- Performance analysis
  - Test execution metrics
  - Slow test identification
  - Performance recommendations
- Coverage reporting
  - Statement coverage
  - Branch coverage
  - Function coverage
  - Uncovered line tracking
- Status reporting
  - Combined metrics
  - Trend analysis
  - Action item generation
