import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, type RootState } from '@store';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const { currentUser } = useAppSelector((state: RootState) => state.user);

  // Only consider authenticated if both flags are true
  const isFullyAuthenticated = isAuthenticated && !!currentUser;

  // Login page is always accessible if not fully authenticated
  if (location.pathname === '/login') {
    if (!isFullyAuthenticated) {
      return <>{children}</>;
    }
    return <Navigate to="/" replace />;
  }

  // For other public routes, redirect to home if authenticated
  if (isFullyAuthenticated) {
    const intendedPath = location.state?.from || '/';
    return <Navigate to={intendedPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
