# Redux Component Migration Checklist

This checklist serves as a guide for converting existing components to use Redux, following the patterns established in our Login component.

## 1. Initial Analysis
- [ ] Identify current state management method (local state, context, etc.)
- [ ] List all state variables and their purposes
- [ ] Identify which state should be local vs global
- [ ] Document component's data flow and side effects
- [ ] Note any existing error handling patterns

## 2. Redux Store Preparation
- [ ] Import required Redux hooks:
```typescript
import { useAppDispatch, useAppSelector } from '../store';
```
- [ ] Import relevant slice actions:
```typescript
import { setData, setError } from '../store/slices/someSlice';
```
- [ ] Verify slice interfaces match component needs:
```typescript
interface SliceState {
  data: DataType | null;
  loading: boolean;
  error: string | null;
}
```

## 3. State Migration
- [ ] Replace context/global state with Redux:
```typescript
// Before
const { data } = useContext(SomeContext);

// After
const { data } = useAppSelector(state => state.someSlice);
```

- [ ] Identify local state to keep:
```typescript
// Keep local UI state
const [localState, setLocalState] = useState('');
```

- [ ] Add loading states:
```typescript
const [localLoading, setLocalLoading] = useState(false);
const { loading: globalLoading } = useAppSelector(state => state.someSlice);
```

## 4. Action Implementation
- [ ] Convert state updates to dispatches:
```typescript
// Before
setGlobalData(newData);

// After
dispatch(setData(newData));
```

- [ ] Implement error handling:
```typescript
try {
  dispatch(setData(newData));
  dispatch(setError(null));
  toast.success('Success!');
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  dispatch(setError(errorMessage));
  toast.error('Failed');
}
```

## 5. Side Effects Update
- [ ] Update useEffect dependencies:
```typescript
useEffect(() => {
  if (!globalLoading && condition) {
    // Handle effect
  }
}, [globalLoading, condition]);
```

- [ ] Add loading screens:
```typescript
if (globalLoading) {
  return <LoadingScreen />;
}
```

## 6. Type Safety
- [ ] Add proper typing to component:
```typescript
const Component: React.FC<Props> = () => {
```

- [ ] Type Redux selectors:
```typescript
const { data } = useAppSelector((state: RootState) => state.someSlice);
```

## 7. Error Handling
- [ ] Implement toast notifications
- [ ] Add error state handling
- [ ] Add loading state feedback
- [ ] Implement error boundaries if needed

## 8. Testing Updates
- [ ] Update/add unit tests for Redux integration
- [ ] Test loading states
- [ ] Test error scenarios
- [ ] Test side effects
- [ ] Test user feedback (toasts)

## 9. Performance Checks
- [ ] Verify memoization needs
- [ ] Check re-render patterns
- [ ] Optimize selector usage
- [ ] Review effect dependencies

## 10. Documentation
- [ ] Update component documentation
- [ ] Document Redux state usage
- [ ] Note any special handling
- [ ] Update type definitions

## Final Verification
- [ ] Component follows project conventions
- [ ] All state updates use Redux appropriately
- [ ] Error handling is comprehensive
- [ ] Loading states are handled
- [ ] User feedback is implemented
- [ ] Types are properly defined
- [ ] Tests are passing

## Example Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { someAction } from '../store/slices/someSlice';
import { toast } from 'sonner';

const NewComponent: React.FC = () => {
  // Local state
  const [localState, setLocalState] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Redux state
  const dispatch = useAppDispatch();
  const { data, loading: globalLoading } = useAppSelector(state => state.someSlice);

  // Side effects
  useEffect(() => {
    if (someCondition) {
      // Handle effect
    }
  }, [someCondition]);

  // Event handlers
  const handleOperation = async () => {
    setLocalLoading(true);
    try {
      // Perform operation
      dispatch(someAction(data));
      toast.success('Success!');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      dispatch(setError(errorMessage));
      toast.error('Failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Loading state
  if (globalLoading) {
    return <LoadingScreen />;
  }

  return (
    // Component JSX
  );
};

export default NewComponent;
```

## Reference Implementation
See `src/components/Login.tsx` for a complete example of these patterns in action.
