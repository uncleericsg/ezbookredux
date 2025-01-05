import React from 'react';
import { motion } from 'framer-motion';

export const WelcomeHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-6"
    >
      <img
        className="mx-auto h-16 w-auto"
        src="/logo.png"
        alt="Easy Booking Logo"
      />
      <h2 className="mt-2 text-xl font-bold leading-7 tracking-tight text-[#FFD700]">
        Welcome to Easy Booking
      </h2>
    </motion.div>
  );
};

export default WelcomeHeader;