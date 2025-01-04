import React from 'react';
import { motion } from 'framer-motion';
import { getStyle, cn } from '../../styles/common';
import type { ActionButtonProps } from '../../types';

/**
 * Common button component with animation support
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = 'button',
  variant = 'primary',
  className,
  animate = false,
  icon
}) => {
  // Base button styles
  const buttonStyles = cn(
    getStyle('buttons', 'base'),
    getStyle('buttons', variant),
    loading || disabled ? 'opacity-50 cursor-not-allowed' : '',
    'group', // For icon animations
    className
  );

  // Animation variants
  const buttonVariants = {
    hover: {
      y: [-2, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      y: 2,
      transition: {
        duration: 0.1
      }
    },
    float: {
      y: [0, -4, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={buttonStyles}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      animate={animate ? "float" : undefined}
    >
      {/* Loading State */}
      {loading ? (
        <div className={getStyle('utils', 'center')}>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        </div>
      ) : (
        // Content with Optional Icon
        <div className={getStyle('utils', 'center')}>
          <span>{children}</span>
          {icon && (
            <div className={getStyle('buttons', 'icon')}>
              {icon}
            </div>
          )}
        </div>
      )}
    </motion.button>
  );
};

export default ActionButton;