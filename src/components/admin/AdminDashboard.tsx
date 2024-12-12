import React, { memo, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminNav, { tabs } from './AdminNav';
import AdminPanelLoader from './AdminPanelLoader';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { Menu, LogOut, ChevronLeft } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { ROUTES } from '../../config/routes';

const AdminDashboard = memo(() => {
  const { activeTab, setActiveTab } = useAdminDashboard();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTabChange = (index: number) => {
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

      {/* Admin Layout */}
      <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed lg:relative z-50 w-64 h-full bg-gray-800 border-r border-gray-700 shadow-2xl lg:shadow-none"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-white lg:hidden"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
              </div>
              <AdminNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
                collapsed={false}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          <div className="container mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<Navigate to={ROUTES.ADMIN.SERVICES} replace />} />
              {tabs.map((tab) => (
                <Route
                  key={tab.id}
                  path={tab.path.replace(ROUTES.ADMIN.ROOT, '')}
                  element={
                    <Suspense fallback={
                      <div className="flex items-center justify-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <motion.div
                        key={tab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AdminPanelLoader panel={tab.id} />
                      </motion.div>
                    </Suspense>
                  }
                />
              ))}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
});

export default AdminDashboard;