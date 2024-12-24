# Path Aliases Migration Plan
**Created: December 25, 2024, 07:47:25 GMT+8**

## Introduction
This document outlines the implementation strategy for path aliases in the iAircon EasyBooking platform. The migration aims to improve code maintainability, prepare for future frontend/backend separation, and establish consistent import patterns across the codebase. This change affects only logical organization and import statements - no UI, visual elements, or styling will be modified.

## Current Project Structure Analysis
```
src/
├── components/
│   ├── admin/       # MUI-based admin components
│   └── frontend/    # Tailwind-based customer components
├── features/        # Feature-based modules
├── pages/          # Route components
├── services/       # API and external service integrations
├── store/          # Redux store configuration
└── utils/          # Shared utilities
```

## Path Alias Convention

### Base Aliases
```typescript
{
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"],
  "@features/*": ["src/features/*"],
  "@pages/*": ["src/pages/*"],
  "@services/*": ["src/services/*"],
  "@store/*": ["src/store/*"],
  "@utils/*": ["src/utils/*"]
}
```

### Feature-Specific Aliases
```typescript
{
  "@admin/*": ["src/components/admin/*"],
  "@frontend/*": ["src/components/frontend/*"],
  "@api/*": ["src/services/api/*"],
  "@hooks/*": ["src/hooks/*"],
  "@types/*": ["src/types/*"]
}
```

## Implementation Steps

### Phase 1: Configuration Setup (1-2 hours)
1. Update `vite.config.ts`:
   ```typescript
   import path from 'path'

   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
         '@components': path.resolve(__dirname, './src/components'),
         // ... other aliases
       }
     }
   })
   ```

2. Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"],
         "@components/*": ["src/components/*"]
         // ... other aliases
       }
     }
   }
   ```

### Phase 2: ESLint Configuration (30 mins)
1. Install required plugins:
   ```bash
   npm install -D eslint-plugin-import eslint-import-resolver-typescript
   ```

2. Update `.eslintrc.js`:
   ```javascript
   module.exports = {
     settings: {
       'import/resolver': {
         typescript: {
           alwaysTryTypes: true
         }
       }
     },
     rules: {
       'import/order': ['error', {
         groups: ['builtin', 'external', 'internal'],
         pathGroups: [
           { pattern: '@/**', group: 'internal' }
         ]
       }]
     }
   }
   ```

### Phase 3: Migration Strategy (2-3 days)

#### Step 1: Component Imports
- Start with shared components
- Move to feature-specific components
- Update imports systematically by feature

#### Step 2: Service Layer
- Update API service imports
- Migrate external service integrations
- Update authentication-related imports

#### Step 3: State Management
- Update Redux store imports
- Migrate context-related imports
- Update selector imports

### Migration Rules
1. **No Visual Changes**
   - Only modify import statements
   - No UI component modifications
   - No style changes

2. **Consistency Guidelines**
   - Use `@components/` for all component imports
   - Use `@services/` for all API/external service imports
   - Use `@store/` for all Redux-related imports

3. **Testing Requirements**
   - Test each component after import updates
   - Verify no visual regressions
   - Ensure all functionality remains intact

## Verification Checklist
- [ ] All path aliases configured in build tools
- [ ] ESLint rules properly enforcing import patterns
- [ ] No visual or UI changes introduced
- [ ] All tests passing
- [ ] Build process successful
- [ ] Development server running correctly
- [ ] No console errors related to imports

## Rollback Plan
1. Maintain a branch with pre-migration state
2. Keep backup of original import statements
3. Document each batch of changes
4. Test thoroughly before merging

## Future Considerations
1. **Frontend/Backend Split**
   - Path aliases will facilitate clean separation
   - Easy identification of cross-boundary dependencies
   - Simplified deployment configuration

2. **Scalability**
   - Easy addition of new feature modules
   - Clear import boundaries for new components
   - Simplified dependency management

## Notes
- This migration affects only import/export statements
- No changes to component logic or styling
- All @ai protection policies and UI guidelines will be strictly followed
- Changes will be made in small, verifiable batches
