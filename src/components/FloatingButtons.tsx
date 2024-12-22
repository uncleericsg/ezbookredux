import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, User, LayoutDashboard, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

interface FloatingButtonsProps {
  showAuthButtons?: boolean;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ showAuthButtons = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAppSelector(state => state.user);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Only show auth buttons if both showAuthButtons is true AND user is authenticated
  const shouldShowAuthButtons = showAuthButtons && isAuthenticated;
  const isAdmin = currentUser?.role === 'admin';

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/+6591234567"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>

      {/* Phone */}
      <motion.a
        href="tel:+6591234567"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200"
      >
        <Phone className="h-6 w-6" />
      </motion.a>

      {/* Only show auth buttons if shouldShowAuthButtons is true */}
      {shouldShowAuthButtons && (
        <>
          <motion.button
            onClick={handleProfileClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-[#FFD700] hover:bg-[#FFD700]/80 text-gray-900 p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200"
          >
            <User className="h-6 w-6" />
          </motion.button>

          {/* Admin Dashboard Button - Only show for admin users */}
          {isAdmin && (
            <motion.button
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200"
            >
              <LayoutDashboard className="h-6 w-6" />
            </motion.button>
          )}
        </>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};

export default FloatingButtons;