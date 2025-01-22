import type { FC } from 'react';
import type { MotionProps } from 'framer-motion';
import { memo, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const tabs = [
  { path: '/admin/services', label: 'Services' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/settings', label: 'Settings' },
  { path: '/admin/bookings', label: 'Bookings' }
];

import AdminNav from '@components/admin/AdminNav';

import { useAdminDashboard } from '@hooks/useAdminDashboard';
import { useUserRedux } from '@hooks/useUserRedux';

interface Tab {
  path: string;
  label: string;
}

const AdminDashboard: FC = memo((): JSX.Element => {
  const { activeTab, setActiveTab } = useAdminDashboard();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserRedux();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active tab based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const tabIndex = tabs.findIndex(tab => currentPath.startsWith(tab.path));
    if (tabIndex !== -1 && tabIndex !== activeTab) {
      setActiveTab(tabIndex);
    }
  }, [location.pathname, activeTab, setActiveTab]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const handleTabChange = (index: number): void => {
    setActiveTab(index);
    navigate(tabs[index].path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700 w-full">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-white">
            {tabs[activeTab]?.label || 'Admin Dashboard'}
          </h1>
          <span className="text-sm text-gray-400 ml-4">
            {location.pathname === '/admin/services' && 'Manage your services and operations'}
            {location.pathname === '/admin/users' && 'Manage user accounts and permissions'}
            {location.pathname === '/admin/settings' && 'Configure system settings'}
            {location.pathname === '/admin/bookings' && 'View and manage bookings'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 text-sm text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-3.25rem)]">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(sidebarOpen || !isMobile) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed lg:relative z-50 w-64 h-full bg-gray-800 border-r border-gray-700 shadow-2xl lg:shadow-none"
            >
              <AdminNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="h-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export { AdminDashboard };
export default AdminDashboard;