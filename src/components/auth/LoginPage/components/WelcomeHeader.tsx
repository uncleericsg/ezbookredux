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
      {/* Logo with proper dimensions and loading priority */}
      <img
        className="mx-auto h-16 w-auto"
        src="/logo.png"
        alt="iAircon Easy Booking Logo"
        width="64"
        height="64"
        loading="eager"
        // Removed fetchPriority due to React warning
      />
      {/* Main heading for SEO */}
      <h1 
        id="login-title"
        className="mt-2 text-xl font-bold leading-7 tracking-tight text-[#FFD700]"
      >
        Welcome to iAircon Easy Booking
      </h1>
      {/* Descriptive subheading for SEO */}
      <p className="mt-2 text-sm text-gray-300">
        Singapore's Premier Air Conditioning Service Platform
      </p>
    </motion.div>
  );
};

export default WelcomeHeader;