import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './ui/spinner';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'min-h-screen' 
    : 'min-h-[50vh]';

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-4 p-4 text-center"
      >
        <Spinner size="lg" />
        {message && (
          <p className="text-muted-foreground text-sm">{message}</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingScreen;