import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentUser } = useAppSelector((state) => state.user);

  // Debug logging
  console.log('PublicRoute render:', {
    isAuthenticated,
    currentUser: !!currentUser,
    pathname: location.pathname,
    state: location.state
  });

  // Skip redirect for login route
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // Only redirect if both isAuthenticated is true AND we have a currentUser
  if (isAuthenticated && currentUser) {
    const intendedPath = location.state?.from || '/';
    return <Navigate to={intendedPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
