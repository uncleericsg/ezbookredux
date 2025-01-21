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

## Current Focus
Converting component type imports while maintaining declaration file integrity

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
Total Errors: 1572
Files Affected: 373
Current Focus: Phase 1.1 - Error Types and Error Handling 

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
   - [ ] services/admin.ts (FETCH_ADMIN_SETTINGS_ERROR)
   - [ ] services/admin.ts (UPDATE_ADMIN_SETTINGS_ERROR)
   - [ ] services/admin.ts (UPDATE_BRANDING_ERROR)
   - [ ] services/admin.ts (RESET_ADMIN_SETTINGS_ERROR)

3. Fix missing exports and imports:
   - [ ] services/amc.ts (resetVisitLabels)
   - [ ] services/amc.ts (AMCPackage type)
   - [ ] services/ratings.ts (ServiceRating type)
   - [ ] services/repairShopr.ts (ServiceVisit type)

4. Fix type imports in store types:
   - [ ] store/types/admin.types.ts (AdminData)
   - [ ] store/types/auth.types.ts (UserProfile)
   - [ ] store/types/state.types.ts (BookingDetails)
   - [ ] store/types/store.types.ts (RootState)

5. Fix module imports:
   - [ ] services/checkAddressTable.ts (supabaseClient)
   - [ ] services/checkBookingTable.ts (supabaseClient)
   - [ ] services/checkSchema.ts (supabaseClient)
   - [ ] services/checkUserBookingLink.ts (supabaseClient)

6. Fix property and type issues:
   - [ ] services/data.ts (created_at vs createdAt)
   - [ ] services/timeSlotService.ts (createdAt vs created_at)
   - [ ] services/validation/firebaseValidation.ts (role type issues)

7. Fix remaining component files:
   - [ ] admin/* components
   - [ ] booking/* components
   - [ ] profile/* components

## Next Steps
1. Focus on fixing type-only imports in Express route files
2. Address admin service error codes by updating ErrorCode type
3. Fix missing exports and imports in service files
4. Update store type definitions
5. Standardize property naming (created_at vs createdAt)
6. Complete remaining component file conversions 