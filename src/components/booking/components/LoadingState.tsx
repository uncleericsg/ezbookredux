import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';

export const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[300px] w-full"
    >
      <Spinner size="lg" variant="primary" className="mb-4" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </motion.div>
  );
};
