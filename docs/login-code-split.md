# Login Component Code Split Plan - Simplified Approach

## Critical Preservation Notice

### 1. Preserved Functionality (DO NOT CHANGE)
- Current layout and UI design
- All existing CTA button links and navigation
- Mock login logic (91874498/123456)
- Video background and animations
- Redux integration pattern
- Navigation flow and state preservation

### 2. Scope Limitations
```typescript
// KEEP existing mock authentication
if (mobileNumber === '91874498' && otp === '123456') {
  // Existing mock token and user data generation
  const mockToken = `mock-jwt-token-${Date.now()}`;
  const mockUserData = {/*...*/};
}
```

### 3. Button Navigation (PRESERVE AS-IS)
```typescript
// First Time Customer CTAs - DO NOT MODIFY PATHS
navigate('/booking/price-selection', { state: { isFirstTimeCustomer: true } });
navigate('/');  // Browse Services
navigate('/amc/signup');  // AMC Package
```

## Component Structure

### 1. Directory Structure
```
src/components/auth/LoginPage/
├── index.tsx (main container)
├── components/
│   ├── FirstTimeCustomerPanel.tsx
│   ├── ExistingCustomerPanel.tsx
│   ├── VideoBackground.tsx
│   └── WelcomeHeader.tsx
├── styles/
│   └── common.ts
├── hooks/
│   └── useLoginFlow.ts (auth logic & navigation)
```

### 2. Component Responsibilities

#### A. Main Container (index.tsx)
- KEEP existing layout (60/40 split)
- PRESERVE video background integration
- MAINTAIN navigation state management
```typescript
// Keep existing return data logic
const getReturnData = () => {
  if (location.state) return location.state;
  const storedBooking = sessionStorage.getItem('pendingBooking');
  return storedBooking ? JSON.parse(storedBooking) : null;
};
```

#### B. Components (Preserve Functionality)
- FirstTimeCustomerPanel:
  * KEEP all existing navigation paths
  * MAINTAIN current button layout
  * PRESERVE state passing
- ExistingCustomerPanel:
  * KEEP current mock login (91874498/123456)
  * MAINTAIN OTP flow
  * PRESERVE error handling
- VideoBackground & WelcomeHeader (unchanged)

#### C. Authentication Logic (useLoginFlow.ts)
```typescript
const useLoginFlow = () => {
  // KEEP existing state management
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // PRESERVE Redux integration
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // MAINTAIN navigation patterns
  const navigate = useNavigate();
  const location = useLocation();
  const returnData = getReturnData();

  // KEEP existing auth methods
  const handleSendOtp = async () => {/*...*/};
  const handleVerifyOtp = async () => {/*...*/};
  
  // PRESERVE navigation effect
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = returnData?.returnUrl || '/';
      if (returnData?.bookingData) {
        navigate(returnUrl, { 
          state: { bookingData: returnData.bookingData },
          replace: true 
        });
      } else {
        navigate(returnUrl, { replace: true });
      }
    }
  }, [isAuthenticated]);

  return {/*...*/};
};
```

### 3. Implementation Steps

1. Phase 1: Safe Refactoring
- [ ] Create component files (no functional changes)
- [ ] Move existing code to new files
- [ ] Implement CSS modules (maintaining exact styles)
- [ ] Add type definitions (based on existing props)

2. Phase 2: Auth Logic Migration
- [ ] Move existing auth logic to hook
- [ ] KEEP all mock user logic
- [ ] Maintain current Redux integration
- [ ] Preserve navigation patterns

3. Phase 3: Verification
- [ ] Verify all CTAs work exactly as before
- [ ] Confirm mock login still works
- [ ] Test all navigation scenarios
- [ ] Ensure no visual changes

### 4. Success Criteria

1. Functional Preservation
- [ ] All buttons navigate to correct routes
- [ ] Mock login (91874498/123456) works
- [ ] Layout remains exactly the same
- [ ] All animations work as before

2. State Management
- [ ] Redux auth state works as before
- [ ] Navigation state preserved
- [ ] Booking data handling unchanged

3. Visual Consistency
- [ ] No layout changes
- [ ] Same styling and animations
- [ ] Identical responsive behavior

### 5. Notes

1. Key Constraints
- NO changes to layout or design
- NO modifications to navigation paths
- NO changes to mock login logic
- NO alterations to Redux integration

2. Focus Areas
- Code organization only
- Type safety additions
- Better error boundaries
- Improved maintainability

This approach focuses ONLY on code organization while strictly preserving all existing functionality and behavior.