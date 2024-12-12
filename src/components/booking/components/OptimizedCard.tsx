import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OptimizedCardProps {
  name: string;
  logo?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 1 },
  disabled: { scale: 1 }
};

const checkmarkVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

export const OptimizedCard = memo(({
  name,
  logo,
  selected,
  onClick,
  disabled = false,
}: OptimizedCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? "disabled" : "tap"}
      className={`
        relative p-4 rounded-lg border-2 transform-gpu min-h-[4rem]
        transition-colors duration-300 ease-in-out
        ${selected ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-700/70'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#FFD700]/50 cursor-pointer'}
        bg-gray-800/50 backdrop-blur-sm
        m-2
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center space-x-4">
        {logo && (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-6 h-6 object-contain"
          />
        )}
        <span className={`text-base font-medium ${selected ? 'text-[#FFD700]' : 'text-gray-300'} whitespace-nowrap`}>
          {name}
        </span>
        {selected && (
          <motion.div
            variants={checkmarkVariants}
            initial="initial"
            animate="animate"
            className="absolute top-3 right-3"
          >
            <div className="bg-[#FFD700] rounded-full p-1.5 shadow-lg">
              <Check className="w-3.5 h-3.5 text-gray-900" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';
