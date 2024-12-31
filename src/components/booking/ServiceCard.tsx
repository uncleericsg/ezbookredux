import React from 'react';
import { motion } from 'framer-motion';
import { ServiceOption } from './serviceTypes';

interface ServiceCardProps {
  service: ServiceOption;
  onClick: (service: ServiceOption) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <motion.div
      className="bg-gray-800/50 border border-gray-700/70 rounded-lg p-6 cursor-pointer hover:border-[#FFD700]/30 backdrop-blur-sm shadow-lg relative flex flex-col"
      onClick={() => onClick(service)}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {service.usualPrice && (
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 rgba(34, 197, 94, 0.2)",
              "0 0 0 10px rgba(34, 197, 94, 0)",
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
            Save ${service.usualPrice - service.price}
          </span>
        </motion.div>
      )}

      <h3 className="text-xl font-bold text-[#FFD700] mb-4">{service.title}</h3>
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
          <div className="text-sm text-gray-400 line-through mt-1">
            Usual ${service.usualPrice}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-4">{service.description}</p>
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

export default ServiceCard;