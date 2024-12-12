// @ai-doc Navigation component with authentication controls
// @ai-doc CRITICAL: This component handles the main navigation and logout flow
// @ai-doc DO NOT modify the authentication and navigation logic

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Shield, Settings, LogOut, LogIn } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import GuestNotificationModal from './GuestNotificationModal';
import LoginModal from './LoginModal';
import { useUser } from '../contexts/UserContext';
import { useLogout } from '../hooks/useLogout';
import { useNotifications } from '../hooks/useNotifications';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// @ai-doc Main navigation component
// @ai-doc Handles user navigation and authentication state
const Navbar: React.FC = () => {
  const { user } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const isAmcCustomer = user?.lastName?.toLowerCase().includes('amc');
  const isAdmin = user?.role === 'admin';
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // @ai-doc Logout handler - DO NOT modify the logout flow
  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="iAircon Logo"
              />
              <span className="text-xl font-bold text-white">Easy Booking</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                         bg-gradient-to-r from-[#FFD700] to-[#FFA500]
                         text-gray-900 rounded-lg shadow-lg
                         hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]
                         transform hover:-translate-y-0.5
                         transition-all duration-200"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
            
            <button
              onClick={() => user ? navigate('/notifications') : setShowGuestModal(true)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {user && unreadCount > 0 && (
                <NotificationBadge count={unreadCount} />
              )}
            </button>

            {user && (
              <div className="relative">
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Admin"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}

            {user && (
              <>
                <Link
                  to="/settings"
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <GuestNotificationModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
  );
};

export default Navbar;