import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
}

interface CategoryCardProps {
  category: ServiceCategory;
  onSelect: () => void;
  shouldReduceMotion: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
  shouldReduceMotion
}) => {
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
        className={`service-category-card w-full h-full backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 shadow-lg flex flex-col ${
          category.id === 'regular'
            ? 'bg-gradient-to-br from-yellow-900/40 to-slate-900/60 border-yellow-700/50 hover:border-yellow-500/70 hover:shadow-yellow-500/30'
          : category.id === 'powerjet-chemical'
            ? 'bg-gradient-to-br from-cyan-900/40 to-slate-900/60 border-cyan-700/50 hover:border-cyan-500/70 hover:shadow-cyan-500/30'
            : category.id === 'gas-leak'
            ? 'bg-gradient-to-br from-pink-900/40 to-slate-900/60 border-pink-700/50 hover:border-pink-500/70 hover:shadow-pink-500/30'
            : 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50 hover:border-[#FFD700]/30 hover:shadow-[#FFD700]/5'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center mb-6">
          <div className={`p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
            category.id === 'regular'
              ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5'
            : category.id === 'powerjet-chemical'
              ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5'
            : category.id === 'gas-leak'
              ? 'bg-gradient-to-br from-pink-500/20 to-pink-500/5'
            : 'bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5'
          }`}>
            <category.icon className={`h-8 w-8 ${
              category.id === 'regular'
                ? 'text-yellow-400'
              : category.id === 'powerjet-chemical'
                ? 'text-cyan-400'
              : category.id === 'gas-leak'
                ? 'text-pink-400'
                : 'text-[#FFD700]'
            }`} />
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className={`text-xl font-bold mb-3 transition-colors ${
            category.id === 'regular'
              ? 'text-yellow-300'
            : category.id === 'powerjet-chemical'
              ? 'text-cyan-300'
            : category.id === 'gas-leak'
              ? 'text-pink-300'
              : 'text-[#FFD700]'
          }`}>
            {category.name}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>
        
        {category.rating && (
          <div className={`flex items-center space-x-2 mt-6 pt-6 border-t ${
            category.id === 'regular'
              ? 'border-yellow-700/50'
            : category.id === 'powerjet-chemical'
              ? 'border-cyan-700/50'
            : category.id === 'gas-leak'
              ? 'border-pink-700/50'
              : 'border-gray-700/50'
          }`}>
            <Star className={`h-4 w-4 ${
              category.id === 'regular'
                ? 'text-yellow-400'
              : category.id === 'powerjet-chemical'
                ? 'text-cyan-400'
              : category.id === 'gas-leak'
                ? 'text-pink-400'
                : 'text-[#FFD700]'
            }`} />
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