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

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Announcement from '@components/Announcement';
import AppInstallPrompt from '@components/AppInstallPrompt';
import { useAnnouncements } from '@hooks/useAnnouncements';
import { ROUTES_WITHOUT_NAVBAR, ROUTES } from '@config/routes';
type AppRoute = typeof ROUTES[keyof typeof ROUTES];
type NavbarExcludedRoute = typeof ROUTES_WITHOUT_NAVBAR[number];

const Layout: React.FC = () => {
  const { announcements, dismissAnnouncement } = useAnnouncements();
  const currentAnnouncement = announcements[0];
  const location = useLocation();
  const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.includes(location.pathname as NavbarExcludedRoute);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      {currentAnnouncement && (
        <Announcement
          {...currentAnnouncement}
          onDismiss={() => dismissAnnouncement(currentAnnouncement.id)}
        />
      )}
      <main className="flex-grow pt-16 bg-white dark:bg-gray-900">
        <Outlet />
      </main>
      {shouldShowNavbar && <Footer />}
      <AppInstallPrompt />
    </div>
  );
};

export default Layout;
