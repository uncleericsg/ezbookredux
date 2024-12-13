/*
 * @AI_INSTRUCTION - LAYOUT COMPONENT USAGE WARNING
 * This is the main layout component that provides the app shell.
 * 
 * CRITICAL: This component should ONLY be used ONCE in the router configuration
 * as the top-level layout wrapper. NEVER nest this component inside:
 * - ProtectedRoute
 * - Other Layout components
 * - Any other wrapper components
 * 
 * Correct usage in router.tsx:
 * {
 *   element: <Layout />,
 *   children: [
 *     // Routes go here
 *   ]
 * }
 * 
 * Incorrect usage (will cause duplicate headers/footers):
 * {
 *   element: <Layout />,
 *   children: [
 *     {
 *       element: <ProtectedRoute><Layout /></ProtectedRoute>, // NEVER DO THIS
 *       children: []
 *     }
 *   ]
 * }
 */

import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Announcement from './Announcement';
import AppInstallPrompt from './AppInstallPrompt';
import ServiceDueBanner from './ServiceDueBanner';
import FloatingButtons from './FloatingButtons';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAppSelector } from '../store';
import { LoadingScreen } from './LoadingScreen';
import { PROTECTED_ROUTES, ROUTES_WITHOUT_NAVBAR, ROUTES } from '../config/routes';

const Layout: React.FC = () => {
  const { announcements, dismissAnnouncement } = useAnnouncements();
  const currentAnnouncement = announcements[0];
  const { currentUser } = useAppSelector((state) => state.user);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const isLoginPage = pathname === ROUTES.LOGIN;
  const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.includes(pathname);

  useEffect(() => {
    // Check if we're on a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated && !loading) {
      navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
    }

    // Redirect from login page if already authenticated
    if (isLoginPage && isAuthenticated) {
      const intendedPath = location.state?.from?.pathname || ROUTES.HOME;
      navigate(intendedPath, { replace: true });
    }
  }, [isAuthenticated, loading, pathname, navigate, location, isLoginPage]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      {currentAnnouncement && (
        <Announcement
          {...currentAnnouncement}
          onDismiss={() => dismissAnnouncement(currentAnnouncement.id)}
        />
      )}
      {isAuthenticated && <ServiceDueBanner />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {shouldShowNavbar && <Footer />}
      {isAuthenticated && <FloatingButtons />}
      <AppInstallPrompt />
    </div>
  );
};

export default Layout;