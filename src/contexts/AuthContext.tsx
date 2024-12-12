import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'amc' | 'regular';
  amcStatus?: 'active' | 'inactive';
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  condoName?: string;
  lobbyTower?: string;
  unitNumber?: string;
  createdAt: string;
  updatedAt: string;
  bookings?: any[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_USER_KEY = 'auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login: userLogin, logout: userLogout } = useUser();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!storedUser || isAuthenticated !== 'true') {
          Object.keys(localStorage).forEach(key => {
            if (key.includes('admin') || key.includes('auth') || key.includes('user') || key.includes('settings')) {
              localStorage.removeItem(key);
            }
          });
          setUser(null);
        } else {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Sync with UserContext
            userLogin({
              ...parsedUser,
              bookings: []
            });
          } catch {
            localStorage.removeItem(AUTH_USER_KEY);
            localStorage.removeItem('isAuthenticated');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [userLogin]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock admin credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin1',
          email: 'admin@example.com',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+65 9123 4567',
          address: '123 Admin Street',
          amcStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bookings: [],
          unitNumber: '#01-01'
        };
        
        // First set the auth user
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        
        // Then set the user data for UserContext
        localStorage.setItem('userData', JSON.stringify(adminUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Finally update UserContext
        await Promise.resolve(userLogin(adminUser));
        return true;
      }

      // Regular user object for other logins
      const newUser: User = {
        id: '1',
        email,
        role: 'regular',
        amcStatus: 'active',
        firstName: 'Regular',
        lastName: 'User',
        phone: '+65 8765 4321',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookings: [],
        unitNumber: '#02-02'
      };

      // First set the auth user
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      
      // Then set the user data for UserContext
      localStorage.setItem('userData', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Finally update UserContext
      await Promise.resolve(userLogin(newUser));
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
      
      // Clear user states first
      setUser(null);
      userLogout();
      
      // Then clear storage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Navigate using React Router
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
