import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ChemOverhaulService } from '../types/chemoverhaulTypes';

interface ChemOverhaulServiceCardProps {
  service: ChemOverhaulService;
}

const ChemOverhaulServiceCard = ({ service }: ChemOverhaulServiceCardProps) => {
  const savings = service.regularPrice - service.price;

  return (
    <motion.div
      className="relative rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-purple-900/80 to-blue-900/90 border border-purple-700/50"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Savings Badge */}
      <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
        Save ${savings}
      </div>

      {/* Title with Icon */}
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          {service.icon}
        </div>
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-blue-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {service.title}
        </motion.h2>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">${service.price}</span>
          <span className="text-lg text-gray-400 line-through">${service.regularPrice}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <svg 
          className="w-5 h-5 text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span>{service.duration}</span>
      </div>

      {/* Benefits */}
      <ul className="space-y-3 mb-6">
        {service.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ChemOverhaulServiceCard;