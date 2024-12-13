// @ai-doc This file manages the global user state and authentication logic
// @ai-doc DO NOT remove or modify the following core functionality:
// @ai-doc 1. User state management through useReducer
// @ai-doc 2. Local storage synchronization
// @ai-doc 3. Authentication state persistence
// @ai-doc 4. Context provider structure

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUser as setReduxUser, clearUser } from '../store/slices/userSlice';

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
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage and sync with Redux
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          dispatch(setReduxUser(parsedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!reduxUser) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [dispatch, reduxUser]);

  const login = async (userData: User) => {
    try {
      dispatch(setReduxUser(userData));
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Failed to login');
      return false;
    }
  };

  const logout = () => {
    dispatch(clearUser());
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
  };

  const value = {
    user: reduxUser || null,
    loading,
    isAuthenticated: !!reduxUser,
    login,
    logout
  };

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
