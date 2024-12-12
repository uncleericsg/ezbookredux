import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { UserViewType } from '../components/admin/AdminViewToggle';

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
  const { user } = useAuth();
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
  };

  const isFeatureVisible = (feature: string): boolean => {
    // Define feature visibility based on current view
    const featureMap: Record<string, Record<UserViewType, boolean>> = {
      // Navigation Features
      'nav-dashboard': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': false
      },
      'nav-bookings': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': false
      },
      'nav-admin': {
        'admin': true,
        'amc': false,
        'regular': false,
        'non-user': false
      },
      // Booking Features
      'booking-quick': {
        'admin': true,
        'amc': true,
        'regular': false,
        'non-user': false
      },
      'booking-payment': {
        'admin': false,
        'amc': false,
        'regular': true,
        'non-user': true
      },
      'booking-history': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': false
      },
      // Admin Features
      'admin-panel': {
        'admin': true,
        'amc': false,
        'regular': false,
        'non-user': false
      },
      'admin-users': {
        'admin': true,
        'amc': false,
        'regular': false,
        'non-user': false
      },
      'admin-settings': {
        'admin': true,
        'amc': false,
        'regular': false,
        'non-user': false
      },
      // AMC Features
      'amc-features': {
        'admin': true,
        'amc': true,
        'regular': false,
        'non-user': false
      },
      'amc-priority': {
        'admin': true,
        'amc': true,
        'regular': false,
        'non-user': false
      },
      // User Profile Features
      'profile-edit': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': false
      },
      'profile-addresses': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': false
      },
      // Basic Features
      'basic-features': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': true
      },
      'contact-support': {
        'admin': true,
        'amc': true,
        'regular': true,
        'non-user': true
      }
    };

    return featureMap[feature]?.[currentView] ?? false;
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
