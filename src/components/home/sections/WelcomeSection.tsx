import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeSectionProps {
  className?: string;
}

/**
 * WelcomeSection Component
 * Displays the welcome header with logo and title
 */
const WelcomeSection: React.FC<WelcomeSectionProps> = ({ className }) => {
  return (
    <motion.div 
      className={`text-center mb-20 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <motion.h2 
        className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Welcome to iAircon
      </motion.h2>
      
      <motion.p 
        className="text-2xl text-gray-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        No.1 PowerJet Experts in Singapore!
      </motion.p>

      <motion.img
        className="mx-auto h-16 w-auto"
        src="/logo.png"
        alt="Easy Booking Logo"
        width="64"
        height="64"
        loading="eager"
        fetchPriority="high"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
    </motion.div>
  );
};

export default WelcomeSection;