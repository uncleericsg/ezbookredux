import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setAuthenticated, setToken, setLoading } from '../store/slices/authSlice';
import { setUser } from '../store/slices/userSlice';

/**
 * Hook to initialize authentication state from localStorage
 * This runs once when the app starts
 */
export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Remove token from user data if it exists
        const { token: _, ...userWithoutToken } = parsedUser;
        
        dispatch(setToken(token));
        dispatch(setUser(userWithoutToken));
        dispatch(setAuthenticated(true));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }

    dispatch(setLoading(false));
  }, []); // Run only once on mount
};
