import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUser } from '../contexts/UserContext';
import { setUser, setLoading, setError } from '../store/slices/userSlice';
import { setAuthenticated, setToken } from '../store/slices/authSlice';

/**
 * Hook to help migrate from UserContext to Redux
 * This hook synchronizes the UserContext state with Redux state
 * Use this during the transition period while migrating components
 */
export const useUserMigration = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useUser();

  useEffect(() => {
    // Sync user data
    dispatch(setUser(user));
    dispatch(setLoading(loading));
    dispatch(setAuthenticated(isAuthenticated));

    // If you have a token in localStorage, sync it
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setToken(token));
    }
  }, [user, loading, isAuthenticated, dispatch]);

  return null; // This hook is used for its side effects only
};
