import React, { createContext, useContext, useReducer, useState, useCallback, useEffect } from 'react';
import { authenticateUser } from '../services/auth';
import { useBasicUser } from './BasicUserContext';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  paymentMethod: string;
  address: string;
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'amc' | 'regular';
  amcStatus?: 'active' | 'inactive';
  firstName: string;
  lastName: string;
  phone: string;
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

interface CombinedUserContextType {
  // Basic auth features
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Advanced features
  isAuthenticated: boolean;
  userDispatch: React.Dispatch<UserAction>;
  bookings: Booking[];
}

const userReducer = (state: User | null, action: UserAction): User | null => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'CLEAR_USER':
      return null;
    case 'UPDATE_USER':
      return state ? { ...state, ...action.payload } : null;
    default:
      return state;
  }
};

const defaultContextValue: CombinedUserContextType = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  userDispatch: () => {},
  bookings: []
};

const CombinedUserContext = createContext<CombinedUserContextType>(defaultContextValue);

export const CombinedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authenticateUser(email, password);
      userDispatch({ type: 'SET_USER', payload: userData });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    userDispatch({ type: 'CLEAR_USER' });
    setBookings([]);
  }, []);

  // Check for stored auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Add your auth check logic here
        // const storedUser = await checkStoredAuth();
        // if (storedUser) {
        //   userDispatch({ type: 'SET_USER', payload: storedUser });
        // }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth check failed');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const contextValue: CombinedUserContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    userDispatch,
    bookings
  };

  return (
    <CombinedUserContext.Provider value={contextValue}>
      {children}
    </CombinedUserContext.Provider>
  );
};

export const useCombinedUser = () => {
  const context = useContext(CombinedUserContext);
  if (context === undefined) {
    throw new Error('useCombinedUser must be used within a CombinedUserProvider');
  }
  return context;
};

// Add migration support
export const useMigratedUser = () => {
  const basicUser = useBasicUser();
  const combinedUser = useCombinedUser();

  // During migration, components can use either context
  return {
    ...basicUser,
    ...combinedUser,
    // Ensure we don't have conflicting states
    user: combinedUser.user || basicUser.user,
    loading: combinedUser.loading || basicUser.loading,
    error: combinedUser.error || basicUser.error
  };
};

// Export a compatibility hook that matches the old useUser signature
export const useUser = useMigratedUser;
