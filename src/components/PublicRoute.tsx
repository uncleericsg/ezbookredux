import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

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

  // If user is authenticated and has data, redirect to home or intended path
  if (currentUser && isAuthenticated) {
    const intendedPath = location.state?.from || '/';
    return <Navigate to={intendedPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
