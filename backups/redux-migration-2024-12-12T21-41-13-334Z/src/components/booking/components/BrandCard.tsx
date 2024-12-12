import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface BrandCardProps {
  name: string;
  logo?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * A card component for displaying and selecting AC brands
 */
export const BrandCard: React.FC<BrandCardProps> = ({
  name,
  logo,
  selected,
  onClick,
  disabled = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer
        ${selected ? 'border-primary bg-primary/10' : 'border-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center space-x-3">
        {logo && (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-8 h-8 object-contain"
          />
        )}
        <span className="font-medium text-sm">{name}</span>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 text-primary"
          >
            <Check size={20} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
