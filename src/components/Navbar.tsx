// @ai-doc Navigation component with authentication controls
// @ai-doc CRITICAL: This component handles the main navigation and logout flow
// @ai-doc DO NOT modify the authentication and navigation logic

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Shield, Settings, LogOut, LogIn } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import GuestNotificationModal from './GuestNotificationModal';
import LoginModal from './LoginModal';
import { useAppDispatch, useAppSelector } from '@store';
import { setUser } from '@store/slices/userSlice';
import { clearAuth, setAuthenticated, setToken } from '@store/slices/authSlice';
import { resetAdmin } from '@store/slices/adminSlice';
import { useNotifications } from '@hooks/useNotifications';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { RESET_STORE } from '@store';

// @ai-doc Main navigation component
// @ai-doc Handles user navigation and authentication state
const Navbar: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const isAmcCustomer = currentUser?.lastName?.toLowerCase().includes('amc');
  const isAdmin = currentUser?.role === 'admin';
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // @ai-doc Logout handler - DO NOT modify the logout flow
  const handleLogout = async () => {
    try {
      // First clear user data and auth state
      dispatch(setUser(null));
      dispatch(clearAuth());
      dispatch(setAuthenticated(false));
      dispatch(setToken(null));
      // Reset admin state
      dispatch(resetAdmin());
      // Reset entire store
      dispatch({ type: RESET_STORE });
      // Show success message
      toast.success('Logged out successfully');
      // No redirection - stay on current page
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_4px_25px_-5px_rgba(0,0,0,0.08)] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img src="/logo.png" alt="iAircon Logo" className="h-10 w-auto" />
                <span className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                  Easy Booking
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {currentUser && (
                <Link
                  to="/bookings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Bookings
                </Link>
              )}
              {isAmcCustomer && (
                <Link
                  to="/amc"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  AMC Services
                </Link>
              )}
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center">
            {currentUser ? (
              <>
                {/* Notification Bell */}
                <motion.div
                  className="mr-4 relative cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                  {unreadCount > 0 && <NotificationBadge count={unreadCount} />}
                </motion.div>

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="mr-4 text-gray-400 hover:text-gray-500"
                    title="Admin Dashboard"
                  >
                    <Shield className="h-6 w-6" />
                  </Link>
                )}

                {/* Settings */}
                <Link
                  to="/settings"
                  className="mr-4 text-gray-400 hover:text-gray-500"
                  title="Settings"
                >
                  <Settings className="h-6 w-6" />
                </Link>

                {/* User Profile */}
                <Link
                  to="/profile"
                  className="mr-4 text-gray-400 hover:text-gray-500"
                  title="Profile"
                >
                  <User className="h-6 w-6" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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