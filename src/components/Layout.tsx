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
import { useUser } from '../contexts/UserContext';
import { LoadingScreen } from './LoadingScreen';
import { PROTECTED_ROUTES, ROUTES_WITHOUT_NAVBAR } from '../config/routes';

const Layout: React.FC = () => {
  const { announcements, dismissAnnouncement } = useAnnouncements();
  const currentAnnouncement = announcements[0];
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => location.pathname.startsWith(route));
  const hideNavbar = ROUTES_WITHOUT_NAVBAR.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    // Redirect to login if trying to access protected route without authentication
    if (requiresAuth && !loading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [requiresAuth, user, loading, navigate, location]);

  // Show loading state while checking authentication
  if (loading && requiresAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(45deg,rgba(27,24,113,1)_30%,rgba(7,7,9,1)_70%)]">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(45deg,rgba(27,24,113,1)_30%,rgba(7,7,9,1)_70%)] text-gray-100 flex flex-col">
      {user && <AppInstallPrompt />}
      {!hideNavbar && <Navbar />}
      {user && (
        <div className="relative">
          <ServiceDueBanner />
        </div>
      )}
      <main className={`flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${requiresAuth ? 'pb-0' : ''}`}>
        <Outlet />
      </main>
      {currentAnnouncement && (
        <Announcement
          message={currentAnnouncement.message}
          type={currentAnnouncement.type}
          onDismiss={() => dismissAnnouncement(currentAnnouncement.id)}
        />
      )}
      {!hideNavbar && <Footer />}
      {!hideNavbar && <FloatingButtons />}
    </div>
  );
};

export default Layout;