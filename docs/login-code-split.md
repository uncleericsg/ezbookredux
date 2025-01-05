# Login Component Code Split Plan

## Simplified Approach

### 1. Directory Structure
```
src/components/auth/
  ├── LoginPage/
  │   ├── index.tsx (main container)
  │   ├── FirstTimePanel.tsx (left panel)
  │   ├── LoginPanel.tsx (right panel)
  │   └── hooks/
  │       └── useLoginFlow.ts (all auth logic)
  └── hooks/
      └── useAuth.ts (shared auth logic)
```

### 2. Component Responsibilities

#### A. LoginPage/index.tsx
- Main container component
- Video background
- Layout management
- Panel composition
- Navigation state handling

#### B. FirstTimePanel.tsx
- First time customer options
- Welcome header
- Navigation buttons:
  - First time offer
  - Browse services
  - AMC signup

#### C. LoginPanel.tsx
- Mobile input
- OTP handling
- Form validation
- Error display
- Loading states

#### D. useLoginFlow.ts
- Authentication logic
- OTP verification
- Navigation handling
- State management
- Error handling

### 3. State Management

```typescript
// Single hook for all login logic
const useLoginFlow = () => {
  const [state, setState] = useState({
    mobile: '',
    otp: '',
    isLoading: false,
    error: null
  });

  // Auth methods
  const handleLogin = () => {/*...*/};
  const handleOtp = () => {/*...*/};
  
  return { ...state, handleLogin, handleOtp };
};
```

### 4. Navigation Flow

```typescript
// Routes Configuration
<Routes>
  {/* Pages WITH Layout */}
  <Route element={<Layout />}>
    <Route path="/" />
    <Route path="/booking/return-customer" />
  </Route>

  {/* Self-contained Pages */}
  <Route path="/login" />
  <Route path="/booking/*" />
  <Route path="/amc/*" />
</Routes>
```

### 5. Implementation Steps

1. Clean Up
- [x] Remove redundant components
- [x] Remove unnecessary directories
- [x] Consolidate types and constants

2. Create Core Files
- [ ] Create useLoginFlow hook
- [ ] Create FirstTimePanel component
- [ ] Create LoginPanel component
- [ ] Create main container

3. Implement Features
- [ ] Authentication logic
- [ ] Navigation handling
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states

4. Testing
- [ ] Unit tests for hooks
- [ ] Component integration tests
- [ ] Navigation flow tests
- [ ] Error handling tests

### 6. Benefits

1. Maintainability
- Fewer files to manage
- Clear component boundaries
- Simplified state management
- Easier to test

2. Performance
- Reduced bundle size
- Fewer re-renders
- Better code splitting
- Simpler prop drilling

3. Development
- Faster implementation
- Easier debugging
- Clear responsibilities
- Better team collaboration

### 7. Success Criteria

1. Functionality
- All auth flows work correctly
- Navigation behaves as expected
- Forms validate properly
- Errors handled gracefully

2. Performance
- Quick initial load
- Smooth transitions
- Responsive UI
- Efficient state updates

3. Code Quality
- Clear component structure
- Proper type safety
- Consistent styling
- Good test coverage

### 8. Migration Plan

1. Phase 1: Setup
- [x] Create new directory structure
- [x] Remove redundant files
- [ ] Set up new component files

2. Phase 2: Core Logic
- [ ] Implement useLoginFlow
- [ ] Create base components
- [ ] Add navigation handling

3. Phase 3: UI/UX
- [ ] Style components
- [ ] Add animations
- [ ] Implement loading states
- [ ] Handle errors

4. Phase 4: Testing
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Test edge cases
- [ ] Performance testing

### 9. Comparison with Previous Approach

Previous (Over-complicated):
- Many tiny components
- Scattered logic
- Complex directory structure
- Multiple state sources

New (Simplified):
- Focused components
- Centralized logic
- Flat structure
- Single source of truth

This simplified approach maintains all functionality while reducing complexity and improving maintainability.