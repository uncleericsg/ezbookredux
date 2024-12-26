// @ai-doc This hook handles the logout flow and navigation
// @ai-doc CRITICAL: This hook must be used within both Router and UserProvider contexts
// @ai-doc DO NOT modify the core logout and navigation logic

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@contexts/UserContext';

// @ai-doc Custom hook that combines logout and navigation
// @ai-doc This will be compatible with any auth provider (Firebase, Auth0, etc.)
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useUser();

  // @ai-doc Logout function that handles both state cleanup and navigation
  // @ai-doc When implementing Firebase:
  // @ai-doc 1. This will call Firebase's signOut method
  // @ai-doc 2. The contextLogout will be triggered by Firebase's auth state change
  // @ai-doc 3. Navigation will happen after successful signOut
  const logout = useCallback(async () => {
    try {
      // When implementing Firebase, add:
      // await firebaseAuth.signOut();
      
      contextLogout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [contextLogout, navigate]);

  return logout;
};
