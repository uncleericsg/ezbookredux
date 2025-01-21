import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootState } from '../store';
import { 
  setUser, 
  setLoading, 
  setError, 
  updateUserProfile,
  requestOTP,
  verifyUserOTP,
  clearUser
} from '../store/slices/userSlice';
import { setAuthenticated, setToken, clearAuth } from '../store/slices/authSlice';
import { toast } from 'sonner';
import type { User, OTPVerificationPayload } from '../types/user';
import type { BookingData } from '../types/booking-flow';
import { useNavigate } from 'react-router-dom';
import { RESET_STORE } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * Hook to handle user state management with Redux
 */
export const useUserRedux = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Select state from Redux store
  const user = useAppSelector((state: RootState) => state.user.currentUser);
  const loading = useAppSelector((state: RootState) => state.user.loading);
  const error = useAppSelector((state: RootState) => state.user.error);
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const verificationId = useAppSelector((state: RootState) => state.user.verificationId);
  const phone = useAppSelector((state: RootState) => state.user.phone);

  // Request OTP handler
  const requestPhoneOTP = useCallback(async (phoneNumber: string) => {
    try {
      dispatch(setLoading(true));
      const result = await dispatch(requestOTP(phoneNumber)).unwrap();
      if (result.verificationId) {
        toast.success('OTP sent successfully');
        return true;
      } else {
        toast.error('Failed to send OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Verify OTP handler
  const verifyPhoneOTP = useCallback(async (code: string) => {
    if (!verificationId || !phone) {
      toast.error('Please request OTP first');
      return false;
    }

    try {
      dispatch(setLoading(true));
      const payload: OTPVerificationPayload = { code, verificationId, phone };
      const user = await dispatch(verifyUserOTP(payload)).unwrap();
      
      if (user) {
        dispatch(setAuthenticated(true));
        toast.success('Successfully logged in');
        return true;
      } else {
        toast.error('Invalid OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, verificationId, phone]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      dispatch(clearAuth());
      dispatch({ type: RESET_STORE });
      localStorage.clear();
      void navigate('/login');
      toast.success('Successfully logged out');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      toast.error(errorMessage);
    }
  }, [dispatch, navigate]);

  // Update profile handler
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      dispatch(updateUserProfile(data));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      return false;
    }
  }, [dispatch]);

  // Update bookings handler
  const updateBookings = useCallback((bookings: BookingData[]) => {
    if (user) {
      dispatch(updateUserProfile({ ...user, bookings }));
    }
  }, [dispatch, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    token,
    verificationId,
    phone,
    requestPhoneOTP,
    verifyPhoneOTP,
    logout,
    updateProfile,
    updateBookings
  };
};
