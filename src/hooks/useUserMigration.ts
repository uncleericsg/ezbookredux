import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { setUser, setLoading } from '@store/slices/userSlice';
import { setAuthenticated, setToken } from '@store/slices/authSlice';

/**
 * Hook to handle user authentication state
 * This hook manages the synchronization between localStorage and Redux state
 */
export const useUserMigration = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      dispatch(setToken(token));
      dispatch(setAuthenticated(true));
    } else {
      dispatch(setToken(null));
      dispatch(setAuthenticated(false));
      dispatch(setUser(null));
    }
    
    dispatch(setLoading(false));
  }, []); // Only run once on mount

  // Log auth state
  useEffect(() => {
    console.log('Auth State:', {
      hasUser: !!user,
      isAuthenticated,
      hasToken: !!localStorage.getItem('auth_token')
    });
  }, [user, isAuthenticated]);

  return null;
};
