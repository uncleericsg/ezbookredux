import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  setUser, 
  setLoading, 
  setError, 
  updateUserProfile,
  requestOTP,
  verifyUserOTP
} from '../store/slices/userSlice';
import { setAuthenticated, setToken, clearAuth } from '../store/slices/authSlice';
import { sendOTP, verifyOTP } from '../services/auth';
import { toast } from 'sonner';
import type { User, Booking } from '../types/user';
import { useNavigate } from 'react-router-dom';
import { RESET_STORE } from '../store';
import { signOut } from '../services/firebase';

/**
 * Hook to handle user state management with Redux
 * This replaces the useUser hook from UserContext
 */
export const useUserRedux = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Select state from Redux store
  const user = useAppSelector(state => state.user.currentUser);
  const loading = useAppSelector(state => state.user.loading);
  const error = useAppSelector(state => state.user.error);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const token = useAppSelector(state => state.auth.token);
  const verificationId = useAppSelector(state => state.user.verificationId);
  const phone = useAppSelector(state => state.user.phone);

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
      const user = await dispatch(verifyUserOTP({ 
        code, 
        verificationId, 
        phone 
      })).unwrap();
      
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
      await signOut();
      dispatch(setUser(null));
      dispatch(clearAuth());
      dispatch({ type: RESET_STORE });
      localStorage.clear();
      navigate('/login');
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
  const updateBookings = useCallback((bookings: Booking[]) => {
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
