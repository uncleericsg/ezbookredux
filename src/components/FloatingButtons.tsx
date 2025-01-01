import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, User, LayoutDashboard, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { RootState } from '@store/store';
import type { UserProfile } from '../types/user';

interface FloatingButtonsProps {
  showAuthButtons?: boolean;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ showAuthButtons = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser as UserProfile | null);
  const authState = useAppSelector((state: RootState) => state.auth);
  const isAuthenticated = authState?.isAuthenticated || false;

  // Only show auth buttons if both showAuthButtons is true AND user is authenticated
  const shouldShowAuthButtons = showAuthButtons && isAuthenticated;
  const isAdmin = currentUser?.membershipTier === 'AMC';

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
    const start = window.scrollY;
    const duration = 500; // milliseconds
    const startTime = performance.now();

    const easeOutQuad = (t: number) => t * (2 - t);

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      window.scrollTo(0, start * (1 - easedProgress));
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
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
      transition={{
        duration: 0.3,
        staggerChildren: 0.1
      }}
      style={{ pointerEvents: showButtons ? 'auto' : 'none' }}
    >
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/+6591234567"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ring-2 ring-white/10 hover:ring-white/20"
        title="Chat with us on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M17.507 14.307l-.009.075c-2.199-1.096-2.429-1.242-2.713-.816-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.173-.3-.019-.463.13-.606.134-.125.3-.326.45-.489.146-.157.195-.262.295-.432.098-.172.05-.32-.025-.449-.075-.125-.658-1.58-.9-2.162-.24-.578-.487-.5-.658-.51-.168-.008-.363-.008-.558-.008a1.03 1.03 0 00-.747.355c-.258.273-.99.967-.99 2.355 0 1.387 1.01 2.732 1.15 2.92.14.187 1.984 3.028 4.804 4.132 2.82 1.105 2.82.74 3.328.693.51-.05 1.655-.678 1.887-1.33.232-.653.232-1.21.162-1.33-.07-.12-.27-.192-.57-.342z"/>
          <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .06 5.387.052 11.971c-.004 2.096.546 4.142 1.606 5.945L0 24l6.335-1.652c1.746.95 3.72 1.444 5.71 1.447h.005c6.585 0 11.99-5.387 12-12 .004-3.176-1.238-6.165-3.53-8.346zM12.047 21.781c-1.774 0-3.51-.48-5.03-1.385l-.36-.214-3.75.975.996-3.645-.235-.374c-.926-1.48-1.42-3.18-1.416-4.93.008-5.762 4.697-10.45 10.465-10.45 2.8 0 5.445 1.09 7.405 3.07 1.96 1.98 3.04 4.61 3.035 7.43-.01 5.76-4.7 10.44-10.47 10.44z"/>
        </svg>
      </motion.a>

      {/* Phone */}
      <motion.a
        href="tel:+6591234567"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ring-2 ring-white/10 hover:ring-white/20"
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
            className="bg-yellow-400 hover:bg-yellow-400/80 text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ring-2 ring-gray-900/10 hover:ring-gray-900/20"
            title="View your profile"
          >
            <User className="h-6 w-6" />
          </motion.button>

          {/* Admin Dashboard Button - Only show for admin users */}
          {isAdmin && (
            <motion.button
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ring-2 ring-white/10 hover:ring-white/20"
              title="Admin Dashboard"
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
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 ring-2 ring-white/10 hover:ring-white/20"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default FloatingButtons;
