# Backend Admin Migration Plan

Created: January 27, 2025
Last Updated: January 27, 2025

## Overview

Migration of admin backend components from `/src` to `/server` directory to improve architecture, security, and maintainability. This plan is designed to run in parallel with the Stripe Checkout migration.

## Parallel Execution Strategy

### Shared Resources Coordination

1. **Directory Structure**

   - Coordinate with Stripe migration team on `/server` structure
   - Reuse shared utilities and middleware
   - Share type definitions in `shared/types`

2. **Core Dependencies**

   - Share error handling infrastructure
   - Share logging services
   - Share CORS configuration
   - Share authentication middleware

3. **Timeline Alignment**
   ```mermaid
   gantt
    title Migration Timeline
    dateFormat  YYYY-MM-DD
    section Stripe Migration
    Setup           :2025-01-27, 1d
    Type System     :2025-01-27, 1d
    Backend         :2025-01-28, 1d
    Frontend        :2025-01-29, 1d
    section Admin Migration
    Phase 1 (Setup) :2025-01-27, 1d
    Phase 2 (Core)  :2025-01-28, 1d
    Phase 3-4 (APIs):2025-01-29, 2d
    Phase 5-6 (Integration) :2025-01-31, 1d
   ```

## Migration Phases

### Phase 1: Setup and Infrastructure (Est. 2 hours)

- [ ] Coordinate with Stripe migration on shared directory structure

```bash
/server
├── api/
│   ├── admin/           # Admin-specific routes
│   ├── payments/        # (Stripe team) Payment routes
│   ├── middleware/      # Shared middleware
│   └── routes.ts
├── services/
│   ├── admin/          # Admin services
│   ├── stripe/         # (Stripe team) Payment services
│   └── core/           # Shared core services
├── utils/              # Shared utilities
└── config/             # Shared configuration
```

- [ ] Set up TypeScript configuration (reuse from Stripe migration)
- [ ] Set up shared error handling and logging infrastructure

### Phase 2: Core Services Migration (Est. 4 hours)

- [ ] Migrate Authentication & Authorization
  - [ ] Admin role verification
  - [ ] Protected route middleware (coordinate with Stripe team)
  - [ ] Session management
- [ ] Migrate Error Handling (integrate with Stripe error handling)
  - [ ] Error types and interfaces
  - [ ] Error handling middleware
  - [ ] Logging service

### Phase 3: Admin API Migration (Est. 6 hours)

- [ ] User Management API
  - [ ] List users endpoint
  - [ ] User details endpoint
  - [ ] User update endpoint
- [ ] Service Management API
  - [ ] Service CRUD endpoints
  - [ ] Service configuration endpoints
- [ ] Team Management API
  - [ ] Team CRUD endpoints
  - [ ] Team assignment endpoints
- [ ] Analytics API
  - [ ] Dashboard data endpoints
  - [ ] Report generation endpoints

### Phase 4: Admin Services Migration (Est. 4 hours)

- [ ] Settings Service
  - [ ] Configuration management
  - [ ] Backup/restore functionality
- [ ] Analytics Service
  - [ ] Data collection
  - [ ] Report generation
- [ ] Notification Service
  - [ ] Push notifications
  - [ ] Email templates

### Phase 5: Testing and Validation (Est. 4 hours)

- [ ] Unit Tests
  - [ ] Service tests
  - [ ] API endpoint tests
  - [ ] Middleware tests
- [ ] Integration Tests
  - [ ] API flow tests
  - [ ] Authentication flow tests
  - [ ] Payment integration tests (coordinate with Stripe team)
- [ ] End-to-End Tests
  - [ ] Admin dashboard flows
  - [ ] Critical path testing

### Phase 6: Frontend Integration (Est. 4 hours)

- [ ] Update API endpoints in frontend
- [ ] Update service calls
- [ ] Update error handling
- [ ] Update authentication flow

## Dependencies

- Node.js >=18
- TypeScript
- Express.js
- Prisma
- Supabase Client
- Shared dependencies with Stripe migration:
  - @vercel/node
  - error handling utilities
  - logging infrastructure

## Tracking Progress

### Current Status

- [ ] Phase 1: Not Started
- [ ] Phase 2: Not Started
- [ ] Phase 3: Not Started
- [ ] Phase 4: Not Started
- [ ] Phase 5: Not Started
- [ ] Phase 6: Not Started

### Migration Checklist

#### Files to Migrate

- [ ] `/src/services/admin.ts` → `/server/services/admin/`
- [ ] `/src/api/admin/*` → `/server/api/admin/`
- [ ] `/src/services/serviceManager.ts` → `/server/services/core/`
- [ ] `/src/utils/apiErrors.ts` → `/server/utils/` (coordinate with Stripe team)
- [ ] `/src/config/admin.ts` → `/server/config/`

#### New Files to Create

- [ ] `/server/api/middleware/auth.ts` (shared with Stripe)
- [ ] `/server/api/middleware/validation.ts` (shared with Stripe)
- [ ] `/server/services/core/error.service.ts` (shared with Stripe)
- [ ] `/server/services/core/logger.service.ts` (shared with Stripe)
- [ ] `/server/config/admin.config.ts`

## Coordination Points with Stripe Migration

### Shared Infrastructure

- [ ] Error handling system
- [ ] Logging service
- [ ] Authentication middleware
- [ ] CORS configuration
- [ ] Type system structure

### Integration Testing

- [ ] Payment flow in admin dashboard
- [ ] Error handling integration
- [ ] Authentication flow
- [ ] API response formats

## Rollback Plan

### Rollback Triggers

- Failed integration tests
- Production performance degradation
- Critical security issues
- Conflicts with Stripe migration

### Rollback Steps

1. Revert to previous API endpoints
2. Restore original file structure
3. Update frontend to use old endpoints
4. Validate system functionality
5. Coordinate rollback with Stripe team if necessary

## Post-Migration Tasks

- [ ] Update documentation
- [ ] Performance monitoring setup
- [ ] Security audit
- [ ] Developer training
- [ ] Update deployment scripts
- [ ] Coordinate final integration testing with Stripe team

## Notes

- Keep both old and new implementations running in parallel during migration
- Use feature flags to control rollout
- Monitor error rates and performance metrics
- Regular backups during migration
- Daily sync with Stripe migration team

## Success Criteria

- All tests passing
- No performance degradation
- Successful security audit
- Zero production incidents
- Complete documentation
- Successful integration with Stripe migration
