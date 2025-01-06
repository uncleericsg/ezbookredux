# Acuity Integration Removal Plan

## Progress Tracking (2025-01-06 12:38:50)

### Completed:
- [x] Removed unused acuity files:
  - src/hooks/useAcuityTesting.ts
  - src/services/acuityIntegration.ts
  - src/components/admin/AcuitySettings.tsx
  - src/hooks/useAcuitySettings.ts

### In Progress:
- [ ] Refactoring booking flow files:
  - src/hooks/useAppointments.ts
  - src/hooks/useTimeSlots.ts
  - src/hooks/useAppointmentSuggestions.ts
  - src/components/ServiceScheduling.tsx
  - src/components/ServiceSummary.tsx
  - src/components/admin/AMCPackageMapping.tsx
  - src/components/admin/AMCPackageSettings.tsx

## Files to Remove/Modify

## Acuity Files Usage in Booking Flow

### Used in Booking Flow
1. src/hooks/useAppointments.ts
2. src/hooks/useTimeSlots.ts
3. src/hooks/useAppointmentSuggestions.ts
4. src/components/ServiceScheduling.tsx
5. src/components/ServiceSummary.tsx
6. src/components/admin/AMCPackageMapping.tsx
7. src/components/admin/AMCPackageSettings.tsx

### Unused in Booking Flow
1. src/hooks/useAcuityTesting.ts
2. src/services/acuityIntegration.ts
3. src/components/admin/AcuitySettings.tsx
4. src/hooks/useAcuitySettings.ts

## Deprecation Plan

### Phase 1: Preparation (1 Day)
1. Create this removal plan document
2. Notify all team members
3. Create backup branch: `acuity-backup`

### Phase 2: API Removal (2 Days)
1. Remove Acuity API endpoints from backend
2. Remove API-related code from services
3. Update API documentation

### Phase 3: Component Removal (3 Days)
1. Remove AcuitySettings component
2. Update AdminSettings to remove Acuity integration
3. Remove AMC package mapping functionality
4. Update service scheduling components

### Phase 4: Hook Removal (2 Days)
1. Remove Acuity-specific hooks
2. Update dependent hooks to remove Acuity references
3. Remove test utilities

### Phase 5: Testing & Validation (2 Days)
1. Create new test cases for modified components
2. Run full regression test suite
3. Verify all functionality works without Acuity

### Phase 6: Cleanup (1 Day)
1. Remove unused dependencies
2. Update documentation
3. Final code review

## Risk Mitigation
1. Maintain backup branch until feature is fully removed
2. Create feature flags for gradual removal
3. Monitor error logs after deployment
4. Have rollback plan ready

## Post-Removal Tasks
1. Update onboarding documentation
2. Remove Acuity credentials from all environments
3. Update API rate limiting configuration
4. Remove Acuity-related environment variables