// @ai-doc This file manages the global user state and authentication logic
// @ai-doc DO NOT remove or modify the following core functionality:
// @ai-doc 1. User state management through useReducer
// @ai-doc 2. Local storage synchronization
// @ai-doc 3. Authentication state persistence
// @ai-doc 4. Context provider structure

import React, { createContext, useContext, useReducer, useState, useMemo, useCallback, useEffect } from 'react';
import { authenticateUser } from '../services/auth';
import { toast } from 'sonner';

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

// @ai-doc Role type definition - extend when adding new roles
export type UserRole = 'admin' | 'regular' | 'tech' | 'amc';

// @ai-doc User interface - extend this when adding Firebase
export interface User {
  id: string;
  email: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  amcStatus?: string;
  unitNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  bookings?: Booking[];
  // Technician specific fields
  teamId?: string;
  specializations?: string[];
  availability?: {
    status: 'available' | 'busy' | 'offline';
    lastUpdated: string;
  };
  // @ai-doc Firebase specific fields will be added here
  // uid?: string;
  // emailVerified?: boolean;
  // photoURL?: string;
}

// @ai-doc Auth Actions - extend this when adding new auth methods
type AuthAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_TECH_STATUS'; payload: { status: 'available' | 'busy' | 'offline' } }
  | { type: 'ADD_BOOKING'; payload: Booking };

// @ai-doc Core user reducer - DO NOT remove existing cases
const userReducer = (state: User | null, action: AuthAction): User | null => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'CLEAR_USER':
      return null;
    case 'UPDATE_USER':
      return state ? { ...state, ...action.payload } : null;
    case 'UPDATE_TECH_STATUS':
      if (!state || state.role !== 'tech') return state;
      return {
        ...state,
        availability: {
          status: action.payload.status,
          lastUpdated: new Date().toISOString()
        }
      };
    case 'ADD_BOOKING':
      if (!state) return null;
      return {
        ...state,
        bookings: [...(state.bookings || []), action.payload]
      };
    default:
      return state;
  }
};

// @ai-doc Auth Provider Interface - extend this when adding new auth methods
export interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userDispatch: React.Dispatch<AuthAction>;
  // @ai-doc Auth methods - these will be adapted for Firebase
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// @ai-doc Core context - DO NOT modify the basic structure
const UserContext = createContext<UserContextType | undefined>(undefined);

// @ai-doc Main provider component - authentication logic will be updated for Firebase
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, dispatch] = useReducer(userReducer, null);

  // @ai-doc Initialize user data - this will be updated for Firebase auth state
  useEffect(() => {
    setLoading(true);
    const storedData = localStorage.getItem('userData');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (storedData && isAuthenticated === 'true') {
      try {
        const userData = JSON.parse(storedData);
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuthenticated');
      }
    }
    setLoading(false);
  }, []);

  // @ai-doc Auth methods - these will be replaced with Firebase implementations
  const login = useCallback(async (email: string, password: string) => {
    try {
      const userData = await authenticateUser(email, password);
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' });
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    userDispatch: dispatch,
    login,
    logout
  }), [user, loading, login, logout]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
