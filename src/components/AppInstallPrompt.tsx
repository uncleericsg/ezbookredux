import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@hooks/usePWA';

const PROMPT_DELAY = 3000; // 3 seconds

const AppInstallPrompt: React.FC = () => {
  const { isInstallable, promptInstall, isMobile } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show prompt on desktop
    if (isInstallable && !isMobile) {
      const timer = setTimeout(() => {
        console.log('Showing desktop install prompt');
        setShowPrompt(true);
      }, PROMPT_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isMobile]);

  const handleDismiss = () => {
    console.log('Install prompt dismissed');
    setShowPrompt(false);
  };

  const handleInstall = async () => {
    console.log('Install button clicked');
    await promptInstall();
    setShowPrompt(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  // Don't render anything on mobile
  if (isMobile || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOutsideClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src="/android-icon-96x96.png" alt="App Icon" className="w-16 h-16 rounded-xl" />
              <div>
                <h2 className="text-xl font-semibold">Install iAircon App</h2>
                <p className="text-gray-400 text-sm mt-1">Get the best booking experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>Quick access from your home screen</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>Faster booking experience</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span>Works offline for better reliability</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Install App</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppInstallPrompt;