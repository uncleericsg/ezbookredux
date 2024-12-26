import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, deactivateUser as deactivateUserApi, updateUser as updateUserApi } from '@services/admin';
import { toast } from 'sonner';
import type { User, AMCStatus } from '@types';

const validateUserData = (data: any): data is User[] => {
  if (!Array.isArray(data)) return false;
  return data.every(user => 
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.email === 'string' &&
    ['active', 'expired', 'pending', 'inactive'].includes(user.amcStatus)
  );
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const devUsers = [{
        id: '1',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        phone: '12345678',
        bio: 'Regular user account',
        joinDate: '2023-01-01',
        amcStatus: 'active' as const,
        role: 'regular',
        lastServiceDate: '2024-02-15',
        nextServiceDate: null
      }];
      setUsers(devUsers);
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError(null);
        const data = await fetchUsers();
        
        if (validateUserData(data)) {
          setUsers(data);
        } else {
          setError('Invalid user data structure received from server');
          toast.error('Failed to load user data. Please try again.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load users';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (!import.meta.env.DEV) {
      loadUsers();
    }
  }, []);

  const deactivateUser = useCallback(async (userId: string) => {
    try {
      setError(null);
      await deactivateUserApi(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deactivated successfully');
    } catch (err) {
      const message = 'Failed to deactivate user. Please try again.';
      setError(message);
      toast.error(message);
      throw err;
    }
  }, []);

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await updateUserApi(userId, updates);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      toast.success('User updated successfully');
    } catch (err) {
      const message = 'Failed to update user. Please try again.';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const updateAmcStatus = async (userId: string, newStatus: AMCStatus) => {
    try {
      setError(null);
      await updateUserApi(userId, { amcStatus: newStatus });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, amcStatus: newStatus } : user
      ));
      toast.success(`AMC status ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      const message = 'Failed to update AMC status. Please try again.';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    deactivateUser,
    updateUser,
    updateAmcStatus,
    isLoaded: !loading && error === null
  };
};