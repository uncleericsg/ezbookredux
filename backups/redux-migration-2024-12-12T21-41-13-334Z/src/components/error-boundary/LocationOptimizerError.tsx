import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationOptimizerErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const LocationOptimizerError: React.FC<LocationOptimizerErrorProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-400">
            Error Optimizing Location
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            {error.message || 'Failed to optimize time slots for your location'}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="mt-3 inline-flex items-center space-x-2 text-sm text-red-400 hover:text-red-300"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
