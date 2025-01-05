import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ServiceCategory {
  id: string;            // Category identifier
  name: string;          // Display name
  description: string;   // Category description
  icon: any;            // Icon component
  rating?: number;       // Optional rating
  reviewCount?: number;  // Optional review count
  popular?: boolean;     // Optional popular flag
}

interface CategoryCardProps {
  category: ServiceCategory;
  onSelect: () => void;
  shouldReduceMotion: boolean;
}

/**
 * CategoryCard Component
 * Displays a service category with animations and styling based on category type
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
  shouldReduceMotion
}) => {
  // Get category-specific styles
  const getCategoryStyles = (id: string) => ({
    regular: {
      bg: 'from-amber-600/50 to-[#1a365d]/70',
      border: 'border-amber-500/50',
      hover: 'hover:border-amber-400/70',
      icon: 'text-amber-400 drop-shadow-[0_0_0.3rem_#f59e0b]'
    },
    'powerjet-chemical': {
      bg: 'from-blue-500/50 to-cyan-900/70',
      border: 'border-cyan-400/50',
      hover: 'hover:border-cyan-300/70',
      icon: 'text-cyan-300 drop-shadow-[0_0_0.3rem_#22d3ee]'
    },
    'gas-leak': {
      bg: 'from-red-500/50 to-purple-900/70',
      border: 'border-red-400/50',
      hover: 'hover:border-red-300/70',
      icon: 'text-red-400 drop-shadow-[0_0_0.3rem_#f87171]'
    },
    'amc': {
      bg: 'from-[#FFD700]/60 to-blue-900/70',
      border: 'border-[#FFD700]/50',
      hover: 'hover:border-[#FFD700]/70',
      icon: 'text-[#FFD700] drop-shadow-[0_0_0.3rem_#FFD700]'
    }
  }[id] || {
    bg: 'from-gray-800/95 to-gray-900/95',
    border: 'border-gray-700/50',
    hover: 'hover:border-[#FFD700]/30',
    icon: 'text-[#FFD700]'
  });

  const styles = getCategoryStyles(category.id);

  return (
    <motion.div
      className="relative group"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? {} : { 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
      whileHover={shouldReduceMotion ? {} : { y: -5 }}
    >
      {category.popular && (
        <motion.div
          className="absolute -top-3 -right-3 z-10"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.5
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700] blur-sm opacity-50"></div>
            <div className="relative bg-[#FFD700] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
              Most Popular
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.button
        onClick={onSelect}
        className={`w-full h-full backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 shadow-lg flex flex-col bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.hover} hover:shadow-[#FFD700]/5`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center mb-6">
          <div className={`p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5`}>
            <category.icon className={`h-8 w-8 filter drop-shadow-lg ${styles.icon}`} />
          </div>
        </div>
        
        <div className="flex-grow">
          <motion.h3
            className={`text-xl font-bold mb-3 transition-colors tracking-wide ${styles.icon}`}
            initial={shouldReduceMotion ? {} : { backgroundPosition: '200% 0' }}
            animate={shouldReduceMotion ? {} : { backgroundPosition: '-200% 0' }}
            transition={shouldReduceMotion ? {} : {
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              backgroundImage: shouldReduceMotion ? undefined : `linear-gradient(
                90deg,
                transparent 25%,
                rgba(255,255,255,0.2) 50%,
                transparent 75%
              )`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              backgroundPosition: shouldReduceMotion ? undefined : '200% 0'
            }}
          >
            {category.name}
          </motion.h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>
        
        {category.rating && (
          <div className={`flex items-center space-x-2 mt-6 pt-6 border-t border-${styles.border}`}>
            <Star className={`h-4 w-4 ${styles.icon}`} />
            <span className="text-sm text-gray-300">
              {category.rating} ({category.reviewCount}+ reviews)
            </span>
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default CategoryCard;