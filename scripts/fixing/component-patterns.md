# Component Pattern Analysis

## Pattern Groups

### Group 1: React.FC with Named Export Only
Components that use React.FC type annotation and only have named exports
Example: AdminGridMenu.tsx
```typescript
const Component: React.FC<Props> = () => { ... }
export { Component };
```
Components:
- [ ] AdminGridMenu.tsx
- [ ] AdminRoutes.tsx
- [ ] AdminTheme.tsx
- [ ] ServiceHub.tsx
- [ ] TeamList.tsx
- [ ] TeamManagement.tsx

### Group 2: React.memo with Named Export
Components that use React.memo and have named exports
Example: AdminTabs.tsx
```typescript
export const Component = memo<Props>(() => { ... });
```
Components:
- [ ] AdminTabs.tsx
- [ ] QuickSettings.tsx
- [ ] ScheduledNotifications.tsx
- [ ] IntegrationStatus.tsx
- [ ] UserStatusToggle.tsx
- [x] AdminViewToggle.tsx (Fixed)

### Group 3: React.memo with Named Function
Components that use React.memo with a named function for better debugging
Example: AdminHeader.tsx
```typescript
export const Component = React.memo(function Component() { ... });
```
Components:
- [x] AdminHeader.tsx (Fixed)
- [x] AdminNav.tsx (Fixed)
- [ ] AdminSettings.tsx
- [ ] UserTable.tsx

### Group 4: Function Components with Both Exports
Components that are regular function components with both named and default exports
Example: AdminPanelLoader.tsx
```typescript
export function Component() { ... }
export default Component;
```
Components:
- [x] AdminPanelLoader.tsx (Fixed)
- [x] AdminDashboard.tsx (Fixed)
- [ ] ChatGPTSettings.tsx
- [ ] CustomerSettings.tsx
- [ ] StripeSettings.tsx

### Group 5: FC with Type Exports
Components that export multiple types along with the component
Example: AdminPanels.tsx
```typescript
export type ComponentType = ...;
export interface Props ...;
export const Component: FC<Props> = ...;
```
Components:
- [ ] AdminPanels.tsx
- [ ] ServiceQueue.tsx
- [ ] Overview.tsx

## Fix Strategy by Group

### Group 1 (React.FC with Named Export)
1. Add displayName if missing
2. Add default export
3. Keep named export
4. Run script with manual verification
5. Special care for components with hooks and effects

### Group 2 (React.memo with Named Export)
1. Verify memo wrapper is correct
2. Add displayName if missing
3. Add default export while keeping named export
4. Check for any hook dependencies
5. Manual fixes recommended

### Group 3 (React.memo with Named Function)
1. Keep the named function for better debugging
2. Add displayName if missing
3. Add both exports
4. Verify memo dependencies
5. Manual fixes preferred

### Group 4 (Function Components)
1. Can use fix-exports script directly
2. Verify no special dependencies
3. Add both exports
4. Add displayName
5. Test component after changes

### Group 5 (Type Exports)
1. Manual fixes only
2. Preserve type exports
3. Add component exports
4. Careful with circular dependencies
5. Test type imports in other files

## Next Steps

1. Fix order:
   - Start with Group 4 (simplest)
   - Then Group 1 (consistent pattern)
   - Then Group 2 & 3 (need careful review)
   - Group 5 last (most complex)

2. For each group:
   - Fix one component as example
   - Verify it works
   - Apply same pattern to similar components
   - Test after each batch

3. Testing:
   - Test each component after fixes
   - Verify imports still work
   - Check for circular dependencies
   - Run TypeScript checks
