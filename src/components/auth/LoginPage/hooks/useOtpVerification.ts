import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../store';
import { setUser, setError } from '../../../../store/slices/userSlice';
import { setAuthenticated, setToken } from '../../../../store/slices/authSlice';
import { toast } from 'sonner';
import type { UseOtpVerificationReturn, User } from '../types';

/**
 * Hook for handling OTP verification flow
 * Manages:
 * - Mobile number input and validation
 * - OTP sending and verification
 * - Authentication state updates
 */
export const useOtpVerification = (): UseOtpVerificationReturn => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    setShowOtpButton(value === '91874498');
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSendOtp = async () => {
    if (mobileNumber === '91874498') {
      setOtpSent(true);
      toast.success('OTP sent to your mobile number');
    } else {
      dispatch(setError('Invalid mobile number'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    setLoading(true);

    try {
      // Mock verification - using test number and OTP
      if (mobileNumber === '91874498' && otp === '123456') {
        // Generate mock token
        const mockToken = `mock-jwt-token-${Date.now()}`;

        // Mock user data
        const mockUserData: User = {
          id: '12345',
          phone: mobileNumber,
          role: 'regular',
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

        // Update Redux store
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
    mobileNumber,
    otp,
    loading,
    error: null,
    setOtp,
    setMobileNumber,
    verifyOtp: () => Promise.resolve(handleSubmit(new Event('submit') as any)),
    resendOtp: () => Promise.resolve(handleSendOtp()),
    showOtpInput: otpSent,
    showOtpButton,
    otpSent,
    handleMobileNumberChange,
    handleOtpChange,
    handleSendOtp,
    handleSubmit
  };
};

export default useOtpVerification;