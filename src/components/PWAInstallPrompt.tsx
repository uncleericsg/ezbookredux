import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWA } from '@hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, promptInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleInstall = async () => {
    await promptInstall();
    setShowPrompt(false);
  };

  if (!isInstallable || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-4 right-4 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/pwa-64x64.png" alt="App Icon" className="w-12 h-12 rounded-xl" />
            <div>
              <h3 className="font-medium">Install iAircon App</h3>
              <p className="text-sm text-gray-400">Add to your home screen for quick access</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={handleInstall}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Install</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;