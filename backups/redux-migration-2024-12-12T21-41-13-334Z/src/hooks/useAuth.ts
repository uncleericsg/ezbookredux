import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export type AMCStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  condoName?: string;
  lobbyTower?: string;
  amcStatus: AMCStatus;
}

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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual auth check logic
    const checkAuth = async () => {
      try {
        // In development, always use mock user
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
        } else {
          // Production logic
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};
