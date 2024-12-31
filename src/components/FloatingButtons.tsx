import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, User, LayoutDashboard, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { RootState } from '@store/store';

interface FloatingButtonsProps {
  showAuthButtons?: boolean;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ showAuthButtons = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  const authState = useAppSelector((state: RootState) => state.auth);
  const isAuthenticated = authState?.isAuthenticated || false;

  // Only show auth buttons if both showAuthButtons is true AND user is authenticated
  const shouldShowAuthButtons = showAuthButtons && isAuthenticated;
  const isAdmin = currentUser?.role === 'admin';

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show buttons when scrolling down past 200px
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setShowButtons(true);
      } 
      // Hide buttons when scrolling up past 200px
      else if (currentScrollY <= 200 || currentScrollY < lastScrollY) {
        setShowButtons(false);
      }
      
      setShowScrollTop(currentScrollY > 200);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    <motion.div
      className="fixed bottom-8 right-4 flex flex-col gap-2 z-50"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: showButtons ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: showButtons ? 'auto' : 'none' }}
    >
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
    </motion.div>
  );
};

export default FloatingButtons;
