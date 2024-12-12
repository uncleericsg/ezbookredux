import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authenticateUser } from '../services/auth';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const BasicUserContext = createContext<UserContextType | undefined>(undefined);

export const BasicUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authenticateUser(email, password);
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      setUser(null);
      localStorage.removeItem('userData');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicUserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </BasicUserContext.Provider>
  );
};

export const useBasicUser = () => {
  const context = useContext(BasicUserContext);
  if (context === undefined) {
    throw new Error('useBasicUser must be used within a BasicUserProvider');
  }
  return context;
};

export default BasicUserProvider;
