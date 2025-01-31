import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * A component for indicating booking progress steps
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  label,
  isActive,
  isCompleted,
  onClick,
  disabled = false,
}) => {
  const isClickable = onClick && !disabled;

  return (
    <div
      className={`
        flex items-center space-x-2
        ${isClickable ? 'cursor-pointer' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
          backgroundColor: isCompleted ? '#10B981' : isActive ? '#3B82F6' : '#E5E7EB',
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center"
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
            •
          </span>
        )}
      </motion.div>
      <span
        className={`
          text-sm font-medium
          ${isActive ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        {label}
      </span>
    </div>
  );
};
