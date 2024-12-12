import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setUser, setLoading, setError, updateUserProfile, clearUser } from '../store/slices/userSlice';
import { setAuthenticated, setToken, logout as logoutAuth } from '../store/slices/authSlice';
import { authenticateUser } from '../services/auth';
import { toast } from 'sonner';
import type { User, Booking } from '../types/user';

/**
 * Hook to handle user state management with Redux
 * This replaces the useUser hook from UserContext
 */
export const useUserRedux = () => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux store
  const user = useAppSelector(state => state.user.currentUser);
  const loading = useAppSelector(state => state.user.loading);
  const error = useAppSelector(state => state.user.error);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const token = useAppSelector(state => state.auth.token);

  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        dispatch(setUser(result.user));
        dispatch(setToken(result.token));
        dispatch(setAuthenticated(true));
        localStorage.setItem('authToken', result.token);
        toast.success('Successfully logged in');
        return true;
      } else {
        dispatch(setError(result.error || 'Authentication failed'));
        toast.error(result.error || 'Authentication failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Logout handler
  const logout = useCallback(() => {
    dispatch(clearUser());
    dispatch(logoutAuth());
    localStorage.removeItem('authToken');
    toast.success('Successfully logged out');
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback((updates: Partial<User>) => {
    dispatch(updateUserProfile(updates));
  }, [dispatch]);

  // Add booking
  const addBooking = useCallback((booking: Booking) => {
    if (user) {
      const updatedBookings = [...(user.bookings || []), booking];
      dispatch(updateUserProfile({ bookings: updatedBookings }));
    }
  }, [user, dispatch]);

  // Update technician status
  const updateTechStatus = useCallback((status: 'available' | 'busy' | 'offline') => {
    if (user && user.role === 'tech') {
      dispatch(updateUserProfile({
        availability: {
          status,
          lastUpdated: new Date().toISOString()
        }
      }));
    }
  }, [user, dispatch]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    token,
    login,
    logout,
    updateProfile,
    addBooking,
    updateTechStatus
  };
};
