# Module Export Rules

## Component Export Rules

### 1. Export Pattern
Each component file should follow this export pattern:
```typescript
// 1. Type exports at the top
export type { ComponentProps };

// 2. Component declaration as const
export const ComponentName = ...;

// 3. Add displayName
ComponentName.displayName = 'ComponentName';

// 4. Both named and default exports at bottom
export { ComponentName };
export default ComponentName;
```

### 2. Barrel Files (index.tsx)
Barrel files should use named imports and exports:
```typescript
import { ComponentName } from './ComponentName';
export { ComponentName };
```

### 3. Import Rules
Components can be imported either way:
```typescript
// Named import (preferred for barrel files)
import { ComponentName } from './ComponentName';

// Default import (for direct imports)
import ComponentName from './ComponentName';
```

## Common Issues to Check

1. Missing displayName
2. Missing named exports
3. Missing default exports
4. Missing type exports
5. Duplicate exports
6. Inconsistent export patterns
7. Missing barrel file exports

## Fixing Strategy

1. Scan for Issues:
   - Use static analysis to find components not following the pattern
   - Check for missing displayName
   - Verify export consistency

2. Fix Components:
   - Add missing displayName
   - Ensure both named and default exports exist
   - Move type exports to top
   - Update barrel files

3. Verification:
   - Run TypeScript compiler
   - Check for import errors
   - Verify component rendering
   - Test barrel file imports

## Implementation Notes

1. All components must have displayName for better debugging
2. Type exports should be separate from component exports
3. Support both named and default exports for flexibility
4. Maintain consistent ordering in files
5. Keep barrel files up to date
