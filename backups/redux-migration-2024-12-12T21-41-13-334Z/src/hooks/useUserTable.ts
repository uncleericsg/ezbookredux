import { useState, useCallback, useMemo, useRef } from 'react';
import { useUsers } from './useUsers';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import type { User } from '../types';

export const useUserTable = () => {
  const { users, loading, error, deactivateUser } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const deactivationInProgress = useRef(false);

  const filteredUsers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const handleDeactivate = useCallback(async (userId: string) => {
    if (deactivationInProgress.current) {
      return;
    }

    try {
      deactivationInProgress.current = true;
      await deactivateUser(userId);
      toast.success('User deactivated successfully');
    } catch (error) {
      toast.error('Failed to deactivate user');
    } finally {
      deactivationInProgress.current = false;
    }
  }, [deactivateUser]);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingUser(null);
    setEditForm({});
  }, []);
  return {
    users: paginatedUsers,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeactivate,
    editingUser,
    editForm,
    handleEditUser,
    handleCancelEdit
  };
};