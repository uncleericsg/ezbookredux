import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';
import type { User, AuthState, StoredAuthData } from '@/types/auth';
import { isStoredAuthData, createAuthError } from '@/types/auth';

// Mock user for development
const mockUser: User = {
  id: 'mock-user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '91234567',
  address: '#12-34',
  condoName: 'The Gardens',
  lobbyTower: 'Tower A',
  amcStatus: 'active'
};

/**
 * Hook for managing authentication state
 * @returns Authentication state and loading status
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // Safe JSON parse with type checking
  const safeParseStoredData = useCallback((data: string): StoredAuthData | null => {
    try {
      const parsed = JSON.parse(data);
      if (isStoredAuthData(parsed)) {
        return parsed;
      }
      logger.warn('Invalid stored auth data format');
      return null;
    } catch (error) {
      logger.error('Failed to parse stored auth data:', error);
      return null;
    }
  }, []);

  // Safe localStorage access
  const getStoredAuth = useCallback((): StoredAuthData | null => {
    try {
      const storedData = localStorage.getItem('auth');
      if (!storedData) return null;
      return safeParseStoredData(storedData);
    } catch (error) {
      logger.error('Failed to access localStorage:', error);
      return null;
    }
  }, [safeParseStoredData]);

  // Safe localStorage write
  const setStoredAuth = useCallback((data: StoredAuthData | null): void => {
    try {
      if (data) {
        localStorage.setItem('auth', JSON.stringify(data));
      } else {
        localStorage.removeItem('auth');
      }
    } catch (error) {
      logger.error('Failed to write to localStorage:', error);
      setState(prev => ({
        ...prev,
        error: createAuthError(
          'AUTH_NETWORK_ERROR',
          'Failed to save authentication data'
        )
      }));
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In development, always use mock user
        if (process.env.NODE_ENV === 'development') {
          const mockAuthData: StoredAuthData = {
            user: mockUser,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: Date.now() + 3600000 // 1 hour
          };
          setStoredAuth(mockAuthData);
          setState({
            user: mockUser,
            loading: false,
            error: null
          });
          return;
        }

        // Production auth check
        const storedAuth = getStoredAuth();
        if (!storedAuth) {
          setState({
            user: null,
            loading: false,
            error: null
          });
          return;
        }

        // Check token expiration
        if (storedAuth.expiresAt < Date.now()) {
          setStoredAuth(null);
          setState({
            user: null,
            loading: false,
            error: createAuthError(
              'AUTH_TOKEN_EXPIRED',
              'Authentication token has expired'
            )
          });
          return;
        }

        setState({
          user: storedAuth.user,
          loading: false,
          error: null
        });
      } catch (error) {
        logger.error('Auth check failed:', error);
        setState({
          user: null,
          loading: false,
          error: createAuthError(
            'AUTH_NETWORK_ERROR',
            'Failed to check authentication status'
          )
        });
      }
    };

    checkAuth();
  }, [getStoredAuth, setStoredAuth]);

  return state;
}
