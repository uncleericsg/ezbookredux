import { motion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Star } from 'lucide-react';
import { ServiceCategory } from '../types/serviceCategory';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onSelect: () => void;
  shouldReduceMotion: boolean;
}

const ServiceCategoryCard = ({ 
  category, 
  onSelect,
  shouldReduceMotion
}: ServiceCategoryCardProps) => {
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
        className={`w-full h-full backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 shadow-lg flex flex-col ${
          category.id === 'regular'
            ? 'bg-gradient-to-br from-amber-600/50 to-[#1a365d]/70 border-amber-500/50 hover:border-amber-400/70 hover:shadow-amber-500/30'
          : category.id === 'powerjet-chemical'
            ? 'bg-gradient-to-br from-blue-500/50 to-cyan-900/70 border-cyan-400/50 hover:border-cyan-300/70 hover:shadow-cyan-400/30'
          : category.id === 'gas-leak'
            ? 'bg-gradient-to-br from-red-500/50 to-purple-900/70 border-red-400/50 hover:border-red-300/70 hover:shadow-red-400/30'
          : category.id === 'amc'
            ? 'bg-gradient-to-br from-[#FFD700]/60 to-blue-900/70 border-[#FFD700]/50 hover:border-[#FFD700]/70 hover:shadow-[#FFD700]/30'
          : 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50 hover:border-[#FFD700]/30 hover:shadow-[#FFD700]/5'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center mb-6">
          <div className={`p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm ${
            category.id === 'regular'
              ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/10 shadow-lg shadow-amber-500/20'
            : category.id === 'powerjet-chemical'
              ? 'bg-gradient-to-br from-blue-400/30 to-cyan-500/10 shadow-lg shadow-cyan-400/20'
            : category.id === 'gas-leak'
              ? 'bg-gradient-to-br from-red-400/30 to-purple-500/10 shadow-lg shadow-red-400/20'
            : category.id === 'amc'
              ? 'bg-gradient-to-br from-[#FFD700]/30 to-blue-500/10 shadow-lg shadow-[#FFD700]/20'
            : 'bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5'
          }`}>
            <category.icon className={`h-8 w-8 filter drop-shadow-lg ${
              category.id === 'regular'
                ? 'text-amber-400 drop-shadow-[0_0_0.3rem_#f59e0b]'
              : category.id === 'powerjet-chemical'
                ? 'text-cyan-300 drop-shadow-[0_0_0.3rem_#22d3ee]'
              : category.id === 'gas-leak'
                ? 'text-red-400 drop-shadow-[0_0_0.3rem_#f87171]'
              : category.id === 'amc'
                ? 'text-[#FFD700] drop-shadow-[0_0_0.3rem_#FFD700]'
              : 'text-[#FFD700]'
            }`} />
          </div>
        </div>
        
        <div className="flex-grow">
          <motion.h3
            className={`text-xl font-bold mb-3 transition-colors tracking-wide ${
              category.id === 'regular'
                ? 'text-amber-300 drop-shadow-[0_0_0.2rem_#f59e0b]'
              : category.id === 'powerjet-chemical'
                ? 'text-cyan-200 drop-shadow-[0_0_0.2rem_#22d3ee]'
              : category.id === 'gas-leak'
                ? 'text-red-300 drop-shadow-[0_0_0.2rem_#f87171]'
              : category.id === 'amc'
                ? 'text-[#FFD700] drop-shadow-[0_0_0.2rem_#FFD700]'
              : 'text-[#FFD700]'
            }`}
            initial={shouldReduceMotion ? {} : { backgroundPosition: '200% 0' }}
            animate={shouldReduceMotion ? {} : { backgroundPosition: '-200% 0' }}
            transition={shouldReduceMotion ? {} : {
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              background: shouldReduceMotion ? undefined : `linear-gradient(
                90deg,
                transparent 25%,
                rgba(255,255,255,0.2) 50%,
                transparent 75%
              )`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            {category.name}
          </motion.h3>
          
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
            : category.id === 'amc'
              ? 'border-[#FFD700]/50'
            : 'border-gray-700/50'
          }`}>
            <Star className={`h-4 w-4 ${
              category.id === 'regular'
                ? 'text-yellow-400'
              : category.id === 'powerjet-chemical'
                ? 'text-cyan-400'
              : category.id === 'gas-leak'
                ? 'text-pink-400'
              : category.id === 'amc'
                ? 'text-[#FFD700]'
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

export default ServiceCategoryCard;
