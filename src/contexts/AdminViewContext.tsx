import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { UserViewType } from '../components/admin/AdminViewToggle';
import { RootState } from '../store';

interface AdminViewContextType {
  currentView: UserViewType;
  setCurrentView: (view: UserViewType) => void;
  isFeatureVisible: (feature: string) => boolean;
  resetView: () => void;
}

const AdminViewContext = createContext<AdminViewContextType | undefined>(undefined);

export const useAdminView = () => {
  const context = useContext(AdminViewContext);
  if (!context) {
    throw new Error('useAdminView must be used within an AdminViewProvider');
  }
  return context;
};

interface AdminViewProviderProps {
  children: React.ReactNode;
}

export const AdminViewProvider: React.FC<AdminViewProviderProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentView, setCurrentView] = useState<UserViewType>('non-user');

  // Reset view based on authenticated user's role
  useEffect(() => {
    const storedView = localStorage.getItem('currentView') as UserViewType;
    
    if (user) {
      if (user.role === 'admin') {
        setCurrentView('admin');
        localStorage.setItem('currentView', 'admin');
      } else if (user.role === 'amc') {
        setCurrentView('amc');
        localStorage.setItem('currentView', 'amc');
      } else {
        setCurrentView('regular');
        localStorage.setItem('currentView', 'regular');
      }
    } else {
      setCurrentView('non-user');
      localStorage.removeItem('currentView');
    }
  }, [user]);

  const resetView = () => {
    if (user) {
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else if (user.role === 'amc') {
        setCurrentView('amc');
      } else {
        setCurrentView('regular');
      }
    } else {
      setCurrentView('non-user');
    }
  };

  const isFeatureVisible = (feature: string): boolean => {
    switch (currentView) {
      case 'admin':
        return true; // Admins can see everything
      case 'amc':
        // AMC users can see most features except admin-specific ones
        return !['user-management', 'system-settings'].includes(feature);
      case 'regular':
        // Regular users can only see basic features
        return ['booking', 'profile', 'history'].includes(feature);
      case 'non-user':
        // Non-users can only see public features
        return ['login', 'register', 'about'].includes(feature);
      default:
        return false;
    }
  };

  const value = {
    currentView,
    setCurrentView,
    isFeatureVisible,
    resetView,
  };

  return (
    <AdminViewContext.Provider value={value}>
      {children}
    </AdminViewContext.Provider>
  );
};
