import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminViewContextType {
  isAdminView: boolean;
  setAdminView: (value: boolean) => void;
  toggleAdminView: () => void;
}

const AdminViewContext = createContext<AdminViewContextType | undefined>(undefined);

interface AdminViewProviderProps {
  children: ReactNode;
}

export const AdminViewProvider: React.FC<AdminViewProviderProps> = ({ children }) => {
  const [isAdminView, setIsAdminView] = useState(false);

  const toggleAdminView = () => {
    setIsAdminView(prev => !prev);
  };

  const value = {
    isAdminView,
    setAdminView: setIsAdminView,
    toggleAdminView
  };

  return (
    <AdminViewContext.Provider value={value}>
      {children}
    </AdminViewContext.Provider>
  );
};

export const useAdminView = () => {
  const context = useContext(AdminViewContext);
  if (context === undefined) {
    throw new Error('useAdminView must be used within an AdminViewProvider');
  }
  return context;
};

export default AdminViewContext;
