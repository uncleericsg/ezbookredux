import React from 'react';
import { motion } from 'framer-motion';
import { getStyle, cn } from '../../styles/common';
import { ASSETS } from '../../constants';
import type { WelcomeHeaderProps } from '../../types';

/**
 * Header component with logo and welcome text
 */
export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  className
}) => {
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={cn('text-center mb-6', className)}
    >
      <img
        className={getStyle('responsive', 'image')}
        src={ASSETS.LOGO}
        alt="Easy Booking Logo"
      />
      <h2 className={cn(
        getStyle('text', 'title'),
        'mt-2 leading-7 tracking-tight'
      )}>
        Welcome to Easy Booking
      </h2>
    </motion.div>
  );
};

export default WelcomeHeader;