# MUI Deprecation Plan

## Overview
This document outlines the systematic approach to remove Material-UI (MUI) dependencies from our project and replace them with Tailwind CSS components.

## Phase 1: Assessment
1. Current MUI Usage:
   - `NotFound.tsx`: Uses `Box`, `Typography`, `Button`
   - `BookingSettings.tsx`: Uses `Box`, `Typography`
   - No MUI dependencies in package.json (which explains the build error)

## Phase 2: Component Migration

### 1. NotFound.tsx Migration
Current:
```tsx
<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" textAlign="center" px={3}>
  <Typography variant="h2" component="h1" gutterBottom>404</Typography>
  <Typography variant="h5" component="h2" gutterBottom>Page Not Found</Typography>
  <Button component={Link} to="/" variant="contained" color="primary">Go Home</Button>
</Box>
```

Will be replaced with:
```tsx
<div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-3">
  <h1 className="text-4xl font-bold mb-4">404</h1>
  <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
  <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">Go Home</Link>
</div>
```

### 2. BookingSettings.tsx Migration
Current:
```tsx
<Box>
  <Typography>...</Typography>
</Box>
```

Will be replaced with:
```tsx
<div>
  <p className="text-base">...</p>
</div>
```

## Phase 3: Implementation Steps

1. Create a new branch:
```bash
git checkout -b refactor/remove-mui
```

2. Remove MUI dependencies (if they exist):
```bash
npm uninstall @mui/material @mui/system @emotion/react @emotion/styled
```

3. Migrate components one by one:
   - Start with NotFound.tsx (simpler component)
   - Then migrate BookingSettings.tsx
   - Test each component after migration

4. Update any tests that might be affected

5. Run full test suite:
```bash
npm run test
```

6. Build verification:
```bash
npm run build
```

## Phase 4: Verification

1. Test Cases:
   - Verify NotFound page styling and responsiveness
   - Verify BookingSettings functionality
   - Check for any console errors
   - Test navigation and links

2. Visual Regression:
   - Compare before/after screenshots
   - Verify responsive behavior
   - Check dark mode compatibility

## Phase 5: Documentation

1. Update documentation to reflect Tailwind-only approach
2. Document any new utility classes created
3. Update component usage examples

## Phase 6: Cleanup

1. Remove any remaining MUI-related:
   - Types
   - Theme configurations
   - Utility functions

2. Update ESLint rules to prevent future MUI imports:
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": ["@mui/*"]
    }]
  }
}
```

## Progress Tracking

- [x] Phase 1: Assessment (Completed)
- [ ] Phase 2: Component Migration
  - [ ] NotFound.tsx
  - [ ] BookingSettings.tsx
- [ ] Phase 3: Implementation
- [ ] Phase 4: Verification
- [ ] Phase 5: Documentation
- [ ] Phase 6: Cleanup

## Notes
- Keep track of any issues encountered during migration
- Document any decisions made about component styling patterns
- Update this document as progress is made
