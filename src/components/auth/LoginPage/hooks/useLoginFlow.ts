import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setUser, setError } from '../../../../store/slices/userSlice';
import { setAuthenticated, setToken } from '../../../../store/slices/authSlice';
import { toast } from 'sonner';

export const useLoginFlow = () => {
  // Local state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Navigation and Redux
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Get return URL and booking data
  const getReturnData = () => {
    if (location.state) {
      return location.state;
    }
    const storedBooking = sessionStorage.getItem('pendingBooking');
    return storedBooking ? JSON.parse(storedBooking) : null;
  };

  const returnData = getReturnData();
  const returnUrl = returnData?.returnUrl || '/';
  const bookingData = returnData?.bookingData;

  // Handle navigation after authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, returning to:', returnUrl);
      if (bookingData) {
        navigate(returnUrl, { 
          state: { bookingData },
          replace: true 
        });
      } else {
        navigate(returnUrl, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, returnUrl, bookingData]);

  // Handle mobile number input
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    setShowOtpButton(value === '91874498');
  };

  // Handle OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      handleSubmit(new Event('submit') as any);
    }
  }, [otp]);

  // Handle send OTP
  const handleSendOtp = () => {
    if (mobileNumber === '91874498') {
      setOtpSent(true);
      toast.success('OTP sent to your mobile number');
    } else {
      dispatch(setError('Invalid mobile number'));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      handleSendOtp();
      return;
    }

    setLoading(true);

    try {
      // Mock verification - using test number and OTP
      if (mobileNumber === '91874498' && otp === '123456') {
        // Generate mock token
        const mockToken = `mock-jwt-token-${Date.now()}`;

        // Mock user data - without token
        const mockUserData = {
          id: '12345',
          phone: mobileNumber,
          role: 'regular' as const,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bookings: [],
          notifications: [],
          preferences: {
            language: 'en',
            theme: 'dark',
            notifications: true
          }
        };

        // Store in localStorage
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(mockUserData));

        // Update Redux store - token only in auth slice
        dispatch(setToken(mockToken));
        dispatch(setUser(mockUserData));
        dispatch(setAuthenticated(true));
        dispatch(setError(null));

        toast.success('Login successful!');
        navigate('/', { replace: true });
      } else {
        dispatch(setError('Invalid credentials'));
        toast.error('Invalid OTP. For testing, use mobile: 91874498 and OTP: 123456');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      dispatch(setError(errorMessage));
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    mobileNumber,
    otp,
    loading,
    showOtpButton,
    otpSent,
    // Handlers
    handleMobileNumberChange,
    handleOtpChange,
    handleSendOtp,
    handleSubmit
  };
};

export default useLoginFlow;