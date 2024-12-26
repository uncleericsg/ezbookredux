// @ai-doc Protected route wrapper component
// @ai-doc This component handles role-based access control
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import { useUserMigration } from '@hooks/useUserMigration';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  requiresTech?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAdmin = false,
  requiresTech = false 
}) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { currentUser } = useAppSelector((state) => state.user);

  // Use migration hook during transition
  useUserMigration();

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Debug auth state
  console.log('ProtectedRoute State:', {
    isAuthenticated,
    hasUser: !!currentUser,
    path: location.pathname
  });

  // Check auth state
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role requirements
  if (requiresAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiresTech && currentUser.role !== 'tech') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;