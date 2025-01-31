import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface IssueCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const checkmarkVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 }
};

/**
 * A card component for displaying and selecting AC issues
 */
export const IssueCard: React.FC<IssueCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 transform-gpu min-h-[5rem]
        transition-all duration-200 ease-in-out
        cursor-pointer
        ${selected ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-gray-700/70'}
        ${!selected && 'hover:border-[#FFD700]/50 hover:shadow-[0_0_10px_rgba(255,215,0,0.2)]'}
        bg-gray-800/50 backdrop-blur-sm
        m-1
      `}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {icon && (
          <div className="flex-shrink-0 mt-1 text-[#FFD700]">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base text-[#f7f7f7] mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
          )}
        </div>
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
};
