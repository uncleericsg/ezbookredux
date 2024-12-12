import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem('pwa-banner-dismissed');
    
    checkMobile();
    setShowBanner(isMobile && isInstallable && !isInstalled && !isDismissed);

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isInstallable, isInstalled, isMobile]);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    await promptInstall();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 60, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="fixed top-0 left-0 right-0 bg-[#fcba03] z-50 shadow-md"
        style={{ 
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      >
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="font-sans text-[#1a1a1a]">
              <div className="text-sm font-medium">Get the best booking experience</div>
              <div className="text-xs opacity-75">Install Easy Booking app now</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleInstall}
              className="bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-sm font-medium"
              style={{ minHeight: '44px', minWidth: '44px' }}
              aria-label="Install application"
            >
              Install App
            </button>
            
            <button
              onClick={handleDismiss}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
              aria-label="Dismiss install prompt"
            >
              <span className="text-[#1a1a1a] text-xl">✕</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallBanner;