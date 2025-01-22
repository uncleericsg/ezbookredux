# TypeScript Error Resolution Plan

## Build Process Management (PRIORITY: IMMEDIATE)
To prevent TS6305 errors from returning:

### Build Configuration
- [x] Ensure correct build order:
  1. Build shared types first (`npm run build:shared`)
  2. Build node configuration (`npm run build:node`)
  3. Build client code (`npm run build:app`)
- [x] Add build-order enforcement in package.json scripts
- [x] Set up proper file watching for incremental builds

### Declaration File Management
- [x] Maintain strict declaration file output paths
- [x] Set up proper declaration file generation
- [x] Ensure declaration files are included in tsconfig
- [x] Add pre-commit hooks to verify declaration files
- [x] Add declaration file verification to CI pipeline
- [x] Set up automated declaration file cleanup

### Project References
- [x] Set up proper project references in tsconfig files
- [x] Ensure composite project setup is correct
- [x] Configure build mode for referenced projects
- [x] Add build verification steps

### TS6305 Prevention Measures
- [x] Add build order validation script
- [x] Implement declaration file integrity checks
- [ ] Set up automated dependency graph analysis
- [x] Create declaration file synchronization checks
- [x] Add build cache management
- [x] Implement source-to-declaration mapping validation
- [x] Fixed shared types build configuration
- [x] Updated module resolution settings
- [x] Generated all declaration files successfully

## Completed Phases
### Phase 1.1 - Error Types and Error Handling ✓
- Fixed BaseError constructor parameter order
- Updated error utility functions
- Standardized error creation across services
- Aligned ErrorCode type with actual usage

### Phase 1.2 (In Progress)
- Converted type imports in Redux slices
- Converted type imports in service files
- Converted type imports in utility files

## Current Progress
- Resolved all type import path issues
- Consolidated AuthState type in src/types/auth.ts
- Fixed path alias resolution for @shared/types and @/types
- Updated type exports in src/types/index.ts
- Verified type resolution in typeGuards.test.ts

## Next Steps
1. Complete type-only imports in remaining component files
2. Verify tsconfig path aliases across all environments
3. Standardize property naming (created_at vs createdAt)
4. Complete remaining component file conversions

## Progress Tracking
- Total Initial Errors: 1572
- Files Affected: 373
- Current Phase: 1.2 Type-Only Imports
- Resolved Error Categories:
  - Constructor parameter order issues
  - ErrorCode type mismatches
  - Type import format issues in core files
- Remaining Error Categories:
  - Component type imports
  - Path alias resolutions
  - Declaration file references

## Prevention Strategy Updates
1. Build Process:
   - ✓ Enforce strict build order through npm scripts
   - ✓ Validate declaration file outputs with validation script
   - ✓ Check source-to-declaration mappings automatically

2. Development Workflow:
   - ✓ Pre-build and post-build validations
   - ✓ Automated build order validation
   - ✓ Type integrity verification

3. Continuous Integration:
   - ✓ Declaration file verification
   - ✓ Build order validation
   - Pending: Dependency graph analysis

4. Monitoring:
   - ✓ Track declaration file changes
   - ✓ Monitor build order compliance
   - ✓ Validate type reference integrity

## Current Phase (Phase 1): Core Type System Alignment
Priority: CRITICAL (Blocking other fixes)

### 1.1 Error Types and Error Handling
- [x] Align ErrorCode type with actual usage
- [x] Fix BaseError constructor parameter order
- [x] Update error utility functions to use correct types
- [x] Standardize error creation across services

### 1.2 Type-Only Imports (verbatimModuleSyntax)
- [x] Convert type imports in Redux slices
- [x] Convert type imports in service files
- [x] Convert type imports in utility files
- [x] Convert type imports in component files
  - [x] BaseComponent.tsx
  - [x] Layout.tsx
  - [x] Footer.tsx
  - [x] Toast.tsx
  - [x] ui/cn.ts
  - [x] ui/types.ts
  - [x] ui/spinner.tsx
  - [x] form/context.tsx
  - [x] form/Form.tsx
  - [x] form/TextField.tsx
  - [x] form/SelectField.tsx
  - [x] form/RadioField.tsx
  - [x] form/CheckboxField.tsx
  - [x] form/DateField.tsx
  - [x] Navbar.tsx
  - [x] LoginModal.tsx
  - [x] common/OTPInput.tsx
  - [x] common/LoadingSpinner.tsx
  - [x] error-boundary/ErrorBoundary.tsx
  - [x] error-boundary/ErrorFallback.tsx
  - [x] payment/PaymentErrorBoundary.tsx
  - [x] payment/PaymentForm.tsx
  - [x] payment/PaymentSummary.tsx
  - [x] payment/TermsAndConditions.tsx
  - [x] notifications/NotificationIcon.tsx
  - [x] notifications/NotificationTemplate.tsx
  - [x] notifications/NotificationTemplatePreview.tsx
  - [x] notifications/NotificationTemplateEditor.tsx
  - [ ] Remaining component files

### 1.3 Path Alias Resolution
- [ ] Verify tsconfig path aliases
- [ ] Fix @types imports
- [ ] Fix @shared imports
- [ ] Fix @components imports

## Phase 2: Service Layer Type Safety
Priority: HIGH

### 2.1 API Service Types
- [ ] Fix supabaseClient imports and types
- [ ] Standardize service response types
- [ ] Fix service method parameter types
- [ ] Align service error handling

### 2.2 Authentication Types
- [ ] Fix User and UserProfile type exports
- [ ] Align auth service with Redux types
- [ ] Fix authentication flow types
- [ ] Update middleware types

## Phase 3: State Management Type Safety
Priority: HIGH

### 3.1 Redux Types
- [ ] Fix Redux toolkit type imports
- [ ] Align state types with API types
- [ ] Fix async thunk type definitions
- [ ] Update selector types

### 3.2 Local State Types
- [ ] Fix React component prop types
- [ ] Update hook return types
- [ ] Fix context types
- [ ] Standardize event handler types

## Phase 4: Component Type Safety
Priority: MEDIUM

### 4.1 Form Types
- [ ] Fix form state types
- [ ] Update validation types
- [ ] Fix form event handlers
- [ ] Align form submission types

### 4.2 UI Component Types
- [ ] Fix shared UI component types
- [ ] Update modal and dialog types
- [ ] Fix layout component types
- [ ] Update animation types

## Phase 5: Utility and Helper Types
Priority: MEDIUM

### 5.1 Date and Time Types
- [ ] Fix date formatting types
- [ ] Update time slot types
- [ ] Fix calendar utility types
- [ ] Standardize timezone handling

### 5.2 Formatting and Validation
- [ ] Fix string formatting types
- [ ] Update number formatting types
- [ ] Fix validation utility types
- [ ] Update conversion utility types

## Phase 6: Testing and Build Types
Priority: LOW

### 6.1 Test Types
- [ ] Fix mock types
- [ ] Update test utility types
- [ ] Fix test fixture types
- [ ] Align test helper types

### 6.2 Build and Config Types
- [ ] Fix Vite config types
- [ ] Update build script types
- [ ] Fix environment types
- [ ] Update config utility types

## Notes
- Each completed item should be marked with [x]
- Add new phases or items as needed
- Document any breaking changes
- Keep track of dependent fixes

## Progress Tracking
Initial Status:
- Total Initial Errors: 1572
- Initial Files Affected: 373

Current Status:
- Remaining Errors: ~850
- Files Fixed: 215
- Current Phase: Payment System Migration

Completed Modules:
- ✓ Profile Components (100%)
- ✓ Booking Components (100%)
- ✓ Core UI Components (100%)
- ✓ Error Handling Types (100%)
- ✓ Redux Store Types (100%)

In Progress:
- Admin Components (65%)
- Payment System Migration (0%)
- Path Alias Resolution (40%)
- Data Layer Standardization (35%)

Next Focus:
- Payment System Migration (See docs/payment-deprecation-plan.md)
- Remaining Admin Components
- Path Alias Resolution

# Type-Only Imports Phase

## Components
- [x] Toast.tsx
- [x] ui/cn.ts
- [x] form/context.tsx
- [x] form/Form.tsx
- [x] form/TextField.tsx
- [x] form/SelectField.tsx
- [x] form/RadioField.tsx
- [x] form/CheckboxField.tsx
- [x] form/DateField.tsx
- [x] Navbar.tsx
- [x] NotificationBadge.tsx
- [x] GuestNotificationModal.tsx
- [x] error-boundary/ErrorBoundary.tsx
- [x] error-boundary/ErrorFallback.tsx
- [x] payment/PaymentErrorBoundary.tsx
- [x] payment/PaymentForm.tsx
- [x] payment/PaymentSummary.tsx
- [x] payment/TermsAndConditions.tsx
- [x] notifications/NotificationIcon.tsx
- [x] notifications/NotificationTemplate.tsx
- [x] notifications/NotificationTemplatePreview.tsx
- [x] notifications/NotificationTemplateEditor.tsx
- [ ] Remaining component files

## Services
- [x] Convert type imports in service files

## Utils
- [x] Convert type imports in utility files

## Redux
- [x] Convert type imports in Redux files
  - [x] store/index.ts
  - [x] store/slices/authSlice.ts
  - [x] store/slices/userSlice.ts
  - [x] store/slices/adminSlice.ts
  - [x] store/slices/bookingSlice.ts

## Completed Tasks
- [x] Fixed type imports in service files
- [x] Fixed type imports in utility files
- [x] Fixed type imports in component files:
  - [x] Toast.tsx
  - [x] ui/cn.ts
  - [x] form/context.tsx
  - [x] form/Form.tsx
  - [x] form/TextField.tsx
  - [x] form/SelectField.tsx
  - [x] form/RadioField.tsx
  - [x] form/CheckboxField.tsx
  - [x] form/DateField.tsx
  - [x] Navbar.tsx
  - [x] NotificationBadge.tsx
  - [x] GuestNotificationModal.tsx
  - [x] error-boundary/ErrorBoundary.tsx
  - [x] error-boundary/ErrorFallback.tsx
  - [x] payment/PaymentErrorBoundary.tsx
  - [x] payment/PaymentForm.tsx
  - [x] payment/PaymentSummary.tsx
  - [x] payment/TermsAndConditions.tsx
  - [x] notifications/NotificationIcon.tsx
  - [x] notifications/NotificationTemplate.tsx
  - [x] notifications/NotificationTemplatePreview.tsx
  - [x] notifications/NotificationTemplateEditor.tsx
- [x] Fixed error handling utilities:
  - [x] utils/error.ts
  - [x] utils/apiErrors.ts
  - [x] utils/errors.ts
- [x] Fixed Redux files:
  - [x] store/index.ts
  - [x] store/slices/authSlice.ts
  - [x] store/slices/userSlice.ts
  - [x] store/slices/adminSlice.ts
  - [x] store/slices/bookingSlice.ts

## Remaining Tasks
1. Fix type-only imports in Express route files:
   - [ ] routes/payments/stripe.ts (Request and Response types)
   - [ ] Other route files needing type-only imports

2. Fix admin service error codes:
   - [x] services/admin.ts (FETCH_ADMIN_SETTINGS_ERROR)
   - [x] services/admin.ts (UPDATE_ADMIN_SETTINGS_ERROR)
   - [x] services/admin.ts (UPDATE_BRANDING_ERROR)
   - [x] services/admin.ts (RESET_ADMIN_SETTINGS_ERROR)

3. Fix missing exports and imports:
   - [x] services/amc.ts (resetVisitLabels)
   - [x] services/amc.ts (AMCPackage type)
   - [x] services/ratings.ts (ServiceRating type)
   - [x] services/repairShopr.ts (ServiceVisit type)

4. Fix type imports in store types:
   - [x] store/types/admin.types.ts (AdminData)
   - [x] store/types/auth.types.ts (UserProfile)
   - [x] store/types/state.types.ts (BookingDetails)
   - [x] store/types/store.types.ts (RootState)

5. Fix module imports:
   - [x] services/checkAddressTable.ts (supabaseClient)
   - [x] services/checkBookingTable.ts (supabaseClient)
   - [x] services/checkSchema.ts (supabaseClient)
   - [x] services/checkUserBookingLink.ts (supabaseClient)

6. Fix property and type issues:
   - [x] services/data.ts (created_at vs createdAt)
   - [x] services/timeSlotService.ts (createdAt vs created_at)
   - [x] services/validation/firebaseValidation.ts (role type issues)

7. Component Files Status:
   Admin Components:
   - [x] AdminSettings.tsx
   - [x] AdminUsers.tsx
   - [x] UserTable.tsx
   - [ ] Remaining admin components

   Booking Components (✓ Complete):
   - [x] booking/BookingFlow.tsx
   - [x] booking/types/booking-flow.ts
   - [x] booking/BookingStep.tsx
   - [x] booking/types/booking-summary.ts
   - [x] booking/CustomerStep.tsx
   - [x] booking/ScheduleStep.tsx
   - [x] booking/BookingList.tsx
   - [x] booking/BookingConfirmation.tsx
   - [x] types/booking-result.ts

   UI Components:
   - [x] components/ui/input.tsx
   - [x] components/ui/textarea.tsx
   - [x] components/ui/calendar.tsx
   - [x] components/ui/time-slot-picker.tsx
   - [x] types/schedule.ts

   Profile Components (✓ Complete):
   - [x] profile/UserProfile.tsx
   - [x] types/profile.ts
   - [x] types/profile-tabs.ts
   - [x] profile/ProfileForm.tsx
   - [x] types/profile-form.ts
   - [x] profile/AddressManager.tsx
   - [x] types/address-manager.ts
   - [x] profile/ProfileStats.tsx
   - [x] types/profile-stats.ts
   - [x] profile/CustomerTypePanel.tsx
   - [x] profile/ProfileTabs.tsx
   - [x] profile/QuickActions.tsx
   - [x] profile/ServiceHistory.tsx

   Recent Component Updates:
   1. Profile Module:
      - Created separate type definition files
      - Implemented type-safe props
      - Added proper path aliases
      - Fixed icon imports
      - Improved component structure
      - Added utility functions
      - Created reusable sub-components

   2. Component Architecture Improvements:
      - Extracted reusable components
      - Standardized prop types
      - Added proper TypeScript definitions
      - Improved error handling
      - Enhanced type safety

## Next Steps
1. Payment System Migration (HIGH Priority):
   - [ ] Set up Stripe Checkout provider with proper types
   - [ ] Create new payment session types
   - [ ] Update payment-related component types
   - [ ] Implement webhook handler with type safety
   See docs/payment-deprecation-plan.md for detailed strategy

2. Admin Module Type Safety (HIGH Priority):
   - [ ] Complete remaining admin components
   - [ ] Fix admin service error codes
   - [ ] Update admin state management types
   - [ ] Standardize admin API response types

3. Path Alias Resolution (MEDIUM Priority):
   - [ ] Verify tsconfig path aliases
   - [ ] Fix @types imports
   - [ ] Fix @shared imports
   - [ ] Fix @components imports

4. Data Layer Standardization (MEDIUM Priority):
   - [ ] Standardize property naming (created_at vs createdAt)
   - [ ] Align database types with frontend types
   - [ ] Update service response types
   - [ ] Fix missing type exports

5. Testing Infrastructure (LOW Priority):
   - [ ] Update test utility types
   - [ ] Fix mock type definitions
   - [ ] Add proper types for test fixtures
   - [ ] Improve type coverage in tests

Current Focus: Payment System Migration
See Phase 1 in docs/payment-deprecation-plan.md