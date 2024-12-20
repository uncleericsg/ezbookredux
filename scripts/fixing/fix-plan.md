# Export Style Fix Plan

## Overview of Issues
- **Default Exports:** 49 components
- **Missing DisplayName:** 63 components
- **Missing Type Exports:** 77 components

## Updated Export Style Rules (As per .cascade-config.json)
✅ Component Export Rules:
1. Components must use named exports ONLY (default exports are forbidden)
2. Component must be declared as a const
3. Component must have a displayName
4. Types/interfaces must be exported separately at the top
5. Follow this pattern:
   ```typescript
   // At the top
   export interface ComponentProps {
     // props...
   }

   const Component = ({ ...props }: ComponentProps) => {
     // component code...
   };

   Component.displayName = 'Component';

   export { Component };
   ```

## Fix Phases

### Phase 1: Revert and Fix Exports [./phases/phase1-revert.md]
- Priority: HIGHEST (Most Dependencies)
- Files: 10
- Status: Not Started
- Focus: Revert recent changes, fix exports

### Phase 2: Admin Components [./phases/phase2-admin.md]
- Priority: HIGH
- Files: 5
- Status: Not Started
- Focus: Admin dashboard, settings, layouts

### Phase 3: Update Import Statements [./phases/phase3-imports.md]
- Priority: MEDIUM
- Files: 178
- Status: Not Started
- Focus: Standardize import style, update imports gradually

### Phase 4: Component Type Safety [./phases/phase4-types.md]
- Priority: CRITICAL
- Duration: 1 day
- Status: Not Started
- Focus: Props interface updates, common types

## Verification Steps
1. Run TypeScript compiler after each batch
2. Check all imports still work
3. Verify component renders
4. Test both named and default imports

## Validation Steps
1. TypeScript strict mode checks
2. React DevTools component inspection
3. Error boundary testing
4. Import/export relationship verification

## Notes
- Keep both named and default exports as per .cascade-config.json
- Prefer named imports but maintain default export support
- Update imports gradually to avoid breaking changes
- Monitor TypeScript errors closely during migration

## Progress Tracking

### Phase 1: Revert and Fix Exports
- [ ] Revert Recent Changes (0/10)
- [ ] Admin Components (0/5)

### Phase 2: Update Import Statements
- [ ] Standardize Import Style
- [ ] Import Updates by Section (0/4)

### Phase 3: Component Type Safety
- [ ] Props Interface Updates
- [ ] Common Types

## Next Steps
1. Review and approve plan
2. Set up testing environment
3. Begin with Phase 1: Revert Recent Changes
4. Regular progress updates
