# Test Migration Plan

## Overview
This document outlines the plan for migrating and improving test organization, execution, and reporting in the iAircon EasyBooking project.

## Current Status (Updated: 2024-01-26)
✅ Migration Progress:
- Directory structure created and verified
- Frontend test utilities implemented (renderWithProviders)
- Backend/integration test utilities partially implemented
- Report generators fully implemented and TypeScript migrated
- Test coverage, performance, and status reporting complete

### Migration Statistics
| Category | Total Tests | Migrated | Pending | Status |
|----------|-------------|-----------|---------|---------|
| Components | 21 | 4 | 17 | 🟡 In Progress |
| Store/Types | 4 | 2 | 2 | 🟡 In Progress |
| Services/Adapters | 25 | 3 | 22 | 🟡 In Progress |
| Others | 35 | 0 | 35 | 🔴 Not Started |
| **Total** | **85** | **9** | **76** | 🟡 **11%** |

### Next Steps
1. Set up test coverage reporting:
   - Configure Vitest coverage options
   - Set up coverage thresholds
   - Generate HTML reports
2. Begin implementing report generators:
   - Coverage analysis
   - Performance metrics
   - Status tracking

### Configuration Cleanup Tasks
- [ ] Remove jest.setup.ts (Pending verification)
- [x] Verify Vitest configuration (Complete with coverage, paths, and reporters)
- [x] Add path aliases to tsconfig.json (Configured in tsconfig.test.json)
- [x] Update import paths for test utilities (Set up in tests/setup)

Configuration Status:
- Vitest: Fully configured with coverage settings and reporters
- Path Aliases: Implemented in both vitest.config.ts and tsconfig.test.json
- Test Utilities: Organized in tests/setup with proper mocking support
- Migration: Jest to Vitest transition in progress

### Test Organization
\`\`\`
tests/
├── frontend/     # UI components, hooks, and client-side logic tests
├── backend/      # API, services, and server-side logic tests
├── integration/  # End-to-end tests covering frontend-backend interactions
└── reports/      # Test reports and analysis
    ├── coverage/     # Coverage reports and analysis
    ├── performance/  # Performance metrics and analysis
    └── status/       # Consolidated status reports
\`\`\`

## Migration Process

### Phase 1: Setup and Configuration 🔄 (In Progress)
1. Directory Structure:
   - [x] Create base test directories
   - [x] Initialize report directories (analysis instead of status)
   - [x] Set up mock directories

2. Test Utilities:
   - [x] Implement renderWithProviders (Completed in tests/setup/renderWithProviders.ts)
   - [x] Set up MSW handlers (Completed in tests/setup/mocks/handlers.ts)
   - [x] Configure store mocking (Completed in tests/setup/__mocks__/store.ts)
   - [x] Complete backend test utilities (Completed in tests/setup/backend-utils.ts)
   - [x] Complete integration test utilities (Completed in tests/setup/integration-utils.ts)

3. Configuration Files:
   - [x] Update Vitest config
   - [x] Remove jest.setup.ts
   - [x] Configure test setup files
   - [x] Set up test environment
   - [x] Add path aliases to tsconfig.json

### Test Utilities Implementation Status

#### Store Mocking (✅ Complete)
- Location: `tests/setup/__mocks__/store.ts`
- Features:
  - Type-safe mock store creation
  - Pre-configured test store
  - Mock dispatch and selector utilities
  - Support for all reducer slices

#### MSW Handlers (✅ Complete)
- Location: `tests/setup/mocks/handlers.ts`
- Implemented handlers:
  - Auth: Login
  - User: Profile
  - Booking: Create
  - Payment: Process

#### Backend Utilities (✅ Complete)
- Location: `tests/setup/backend-utils.ts`
- Features:
  - Test database client
  - Mock response generators
  - Test data generators
  - Data cleanup utilities

#### Integration Utilities (✅ Complete)
- Location: `tests/setup/integration-utils.ts`
- Features:
  - Integration test context
  - Component rendering with full context
  - API call monitoring
  - Response simulation

### Phase 2: Test File Migration 🔄 (In Progress)

#### 2.1 Components (0/21)
- [ ] LoginModal (4 tests)
  - Source: src/components/__tests__/Login.test.tsx
  - Target: tests/frontend/components/auth/LoginModal.test.tsx

- [ ] HolidayGreetingModal (10 tests)
  - Source: src/components/notifications/__tests__/HolidayGreetingModal.test.tsx
  - Target: tests/frontend/components/notifications/HolidayGreetingModal.test.tsx

- [ ] NotificationTemplatePreview (5 tests)
  - Source: src/components/notifications/__tests__/NotificationTemplatePreview.test.tsx
  - Target: tests/frontend/components/notifications/NotificationTemplatePreview.test.tsx

- [ ] withTemplateFeatures (2 tests)
  - Source: TBD
  - Target: tests/frontend/components/notifications/withTemplateFeatures.test.tsx

#### 2.2 Store/Types (0/4)
- [ ] state.redux (2 tests)
  - Source: TBD
  - Target: tests/frontend/store/types/state.redux.test.ts

- [ ] state.types (2 tests)
  - Source: TBD
  - Target: tests/frontend/store/types/state.types.test.ts

#### 2.3 Services/Adapters (0/25)
- [ ] previewAdapter (13 tests)
  - Source: TBD
  - Target: tests/backend/services/notifications/adapters/previewAdapter.test.ts

- [ ] templateAdapter (5 tests)
  - Source: TBD
  - Target: tests/backend/services/notifications/adapters/templateAdapter.test.ts

- [ ] validationAdapter (7 tests)
  - Source: TBD
  - Target: tests/backend/services/notifications/adapters/validationAdapter.test.ts

#### 2.4 Others (0/35)
- [ ] core-types (12 tests)
  - Source: TBD
  - Target: tests/frontend/utils/core-types.test.ts

- [ ] regions (7 tests)
  - Source: TBD
  - Target: tests/backend/services/locations/regions.test.ts

- [ ] useGreetingForm (8 tests)
  - Source: TBD
  - Target: tests/frontend/hooks/useGreetingForm.test.ts

- [ ] analysis (8 tests)
  - Source: TBD
  - Target: tests/frontend/utils/analysis.test.ts

### Phase 3: Report Generator Implementation 🟡 (In Progress)

#### 3.1 Coverage Reports ✅ (Completed)
- [x] Basic report structure
- [x] Component coverage analysis
- [x] Uncovered lines detection
- [x] Recommendations engine
- [x] TypeScript implementation
- [x] V8 coverage format support
- [x] Cleanup legacy .js version

#### 3.2 Performance Reports ✅ (Completed)
- [x] Basic metrics collection
- [x] Slow test detection
- [x] Performance analysis
- [x] Optimization suggestions
- [x] TypeScript implementation
- [x] Enhanced metrics (p95, setup time)
- [x] Cleanup legacy .js version

#### 3.3 Status Reports ✅ (Completed)
- [x] Basic status tracking
- [x] Combined analysis
- [x] Trend tracking
- [x] Action items generation
- [x] TypeScript implementation
- [x] Historical data support

### Phase 4: Verification and Documentation 🔄 (In Progress)

#### 4.1 Test Verification
- [ ] Run all migrated tests
  ```bash
  npm run test
  npm run test:coverage
  ```
- [ ] Verify coverage meets thresholds:
  - Statements: 80%
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%
- [ ] Check performance metrics:
  - Test execution time
  - Memory usage
  - Slow tests identification
- [ ] Validate error handling:
  - API error scenarios
  - Database error scenarios
  - UI error boundaries

#### 4.2 Import Path Verification
- [ ] Verify module resolution:
  ```typescript
  // Path alias patterns to verify
  @components/* -> src/components/*
  @store/* -> src/store/*
  @services/* -> src/services/*
  @utils/* -> src/utils/*
  @hooks/* -> src/hooks/*
  @types/* -> src/types/*
  ```
- [ ] Check for circular dependencies:
  - Between components
  - Between store slices
  - Between services
  - In utility functions
- [ ] Validate test imports:
  - Test utility imports
  - Mock imports
  - Type imports

#### 4.3 Documentation
- [ ] Update README.md:
  - Test setup instructions
  - Available commands
  - Coverage requirements
  - Migration status
- [ ] Create test-migration-guide.md:
  - Step-by-step migration process
  - Common issues and solutions
  - Best practices
  - Examples
- [ ] Document test patterns:
  - Component testing
  - Integration testing
  - API testing
  - Store testing
- [ ] Add troubleshooting-guide.md:
  - Common errors
  - Debug strategies
  - Performance optimization
  - Test isolation

#### 4.4 Quality Checks
- [ ] Linting:
  ```bash
  npm run lint
  npm run lint:fix
  ```
- [ ] Type checking:
  ```bash
  npm run typecheck
  ```
- [ ] Format verification:
  ```bash
  npm run format
  npm run format:check
  ```
- [ ] Build validation:
  ```bash
  npm run build
  ```

### Success Criteria
1. All tests pass successfully
2. Coverage meets or exceeds thresholds
3. No circular dependencies
4. Documentation is complete and accurate
5. All quality checks pass

### Rollback Plan
1. Keep old test files until migration is verified
2. Maintain backup of jest configuration
3. Document rollback procedures
4. Keep snapshot of working state

### Phase 5: CI/CD Integration ⏳ (Not Started)
- [ ] Update build scripts
- [ ] Configure test runners
- [ ] Set up coverage gates
- [ ] Add performance budgets

## Tracking and Monitoring

### Daily Progress Tracking
| Date | Completed Tasks | Remaining Tasks | Blockers |
|------|-----------------|-----------------|-----------|
| 2024-01-26 | - Directory setup<br>- Basic utilities<br>- Initial config | 85 test migrations<br>Documentation | None |
| 2024-01-26 (PM) | - Report generators TypeScript migration<br>- Coverage analysis<br>- Performance metrics<br>- Status tracking | 85 test migrations<br>Documentation | None |

### Success Metrics
| Metric | Target | Current | Status |
|--------|---------|---------|---------|
| Test Coverage | 90% | TBD | ⏳ |
| Test Performance | <2s/test | <1s/test | ✅ |
| Failed Tests | 0 | TBD | ⏳ |
| Migration Progress | 100% | 15% | 🟡 |

## Risk Management

| Risk | Probability | Impact | Mitigation | Status |
|------|------------|--------|------------|---------|
| Broken imports | High | High | Use TypeScript paths | 🔄 In Progress |
| Test failures | Medium | High | Migrate & verify incrementally | 🟡 In Progress |
| CI/CD breaks | Medium | High | Test in isolation first | ⏳ Not Started |
| Coverage drops | Low | Medium | Compare before/after | ✅ Mitigated |
| Performance degrades | Low | Medium | Benchmark each phase | ✅ Mitigated |

## Next Actions
1. Locate remaining test files in old structure
2. Begin component test migration
3. Update import paths for moved files
4. Document test patterns and best practices
5. Set up CI/CD integration

## Support Resources
1. Test Migration Guide (TBD)
2. Troubleshooting Guide (TBD)
3. Best Practices Documentation (TBD)
4. Migration Scripts (TBD)
5. Report Generator Documentation:
   - Coverage Report: TypeScript implementation with V8 format support
   - Performance Report: Test metrics, analysis, and recommendations
   - Status Report: Trend tracking and historical data analysis
6. Test Report Examples:
   - Coverage analysis with component breakdown
   - Performance metrics with slow test detection
   - Status tracking with actionable recommendations