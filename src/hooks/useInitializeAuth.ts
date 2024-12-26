import { useEffect } from 'react';
import { useAppDispatch } from '@store';
import { setAuthenticated, setToken } from '@store/slices/authSlice';
import { setUser } from '@store/slices/userSlice';

/**
 * Hook to initialize authentication state from localStorage
 * This runs once when the app starts
 */
export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    // Clear any invalid state
    if (!token || !userData) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(setAuthenticated(false));
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      // Make sure role is preserved
      const userWithRole = {
        ...parsedUser,
        role: parsedUser.role || 'user' // Default to 'user' if no role
      };
      
      dispatch(setToken(token));
      dispatch(setUser(userWithRole));
      dispatch(setAuthenticated(true));
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(setAuthenticated(false));
    }
  }, []); // Run only once on mount
};
