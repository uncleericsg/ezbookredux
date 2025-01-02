import React from 'react';
import { motion } from 'framer-motion';
import { ServiceOption } from './serviceTypes';

interface PremiumServiceCardProps {
  service: ServiceOption;
  onClick: (service: ServiceOption) => void;
}

const PremiumServiceCard: React.FC<PremiumServiceCardProps> = ({ service, onClick }) => {
  const getCardStyles = () => {
    if (service.id === 'fault-checking') {
      return {
        background: 'bg-gradient-to-br from-rose-900/40 to-slate-900/60',
        border: 'border-2 border-rose-500/30 hover:border-rose-500/70',
        shadow: 'hover:shadow-lg hover:shadow-rose-500/30',
        textColor: 'text-rose-300'
      };
    }
    if (service.id === 'powerjet-chemical') {
      return {
        background: 'bg-gradient-to-br from-cyan-900/40 to-slate-900/60',
        border: 'border-2 border-cyan-500/30 hover:border-cyan-500/70',
        shadow: 'hover:shadow-lg hover:shadow-cyan-500/30',
        textColor: 'text-cyan-300'
      };
    }
    if (service.id === 'gas-leakage') {
      return {
        background: 'bg-gradient-to-br from-amber-900/40 to-slate-900/60',
        border: 'border-2 border-amber-500/30 hover:border-amber-500/70',
        shadow: 'hover:shadow-lg hover:shadow-amber-500/30',
        textColor: 'text-amber-300'
      };
    }
    return {
      background: 'bg-gradient-to-br from-gray-800/80 to-gray-900/80',
      border: 'border-2 border-[#FFD700]/30 hover:border-[#FFD700]',
      shadow: 'hover:shadow-[#FFD700]/20',
      textColor: 'text-[#FFD700]'
    };
  };

  const styles = getCardStyles();

  return (
    <motion.div
      className={`${styles.background} ${styles.border} ${styles.shadow} rounded-lg p-6 cursor-pointer backdrop-blur-sm shadow-lg relative flex flex-col`}
      onClick={() => onClick(service)}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute top-0 right-0 ${styles.background.includes('rose') ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 
        styles.background.includes('cyan') ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' :
        styles.background.includes('amber') ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
        'bg-[#FFD700]'} px-3 py-1 rounded-bl-lg font-semibold text-sm flex items-center gap-2`}>
        {service.id === 'fault-checking' ? 'INSPECTION' :
         service.id === 'powerjet-chemical' ? 'CHEMICAL WASH' :
         service.id === 'gas-leakage' ? 'GAS SERVICE' : 'PREMIUM'}
      </div>

      <motion.h3 
        className={`text-xl font-bold ${styles.textColor} mb-4 mt-4`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {service.title}
      </motion.h3>
      <div className="flex flex-col items-center justify-center mb-4">
        <motion.div
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          ${service.price}
        </motion.div>
        {service.usualPrice && (
          <motion.div
            className="text-sm text-gray-400 line-through mt-1"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Usual ${service.usualPrice}
          </motion.div>
        )}
      </div>
      <p className="text-gray-300 text-sm mb-4">{service.description}</p>
      {!['fault-checking', 'powerjet-chemical', 'gas-leakage'].includes(service.id) && (
        <div className="text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {service.duration}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PremiumServiceCard;