import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const FirstTimeCustomerPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700/70 rounded-xl backdrop-blur-sm"
    >
      {/* Section heading */}
      <h2 
        id="new-customer-title"
        className="text-xl font-bold text-[#FFD700] mb-3"
      >
        First Time Customer
      </h2>
      {/* Descriptive text for SEO and user context */}
      <p className="text-gray-300 text-center mb-4 text-sm">
        Experience hassle-free air conditioning services with our easy booking system.
        Get special offers and professional service from Singapore's trusted aircon experts.
      </p>

      {/* Navigation buttons with enhanced accessibility */}
      <div 
        className="w-full space-y-3"
        role="navigation"
        aria-label="First time customer options"
      >
        <motion.button
          animate={{ 
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileTap={{ y: 1 }}
          onClick={() => navigate('/booking/price-selection', { state: { isFirstTimeCustomer: true } })}
          className="w-full inline-flex items-center justify-center px-6 py-2 text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 group shadow-lg shadow-green-500/20 border border-green-500/30 transition-all duration-200"
          aria-label="View first time customer special offers"
        >
          <span>Enjoy First Time Customer Offer</span>
          <ArrowRight 
            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" 
            aria-hidden="true"
          />
        </motion.button>

        <motion.button
          whileTap={{ y: 1 }}
          onClick={() => navigate('/')}
          className="w-full inline-flex items-center justify-center px-6 py-2 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 group shadow-lg shadow-blue-500/20 border border-blue-600/30 transition-all duration-200"
          aria-label="Browse all available air conditioning services"
        >
          <span>Browse All Services</span>
          <ArrowRight 
            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" 
            aria-hidden="true"
          />
        </motion.button>

        <motion.button
          whileTap={{ y: 1 }}
          onClick={() => navigate('/amc/signup')}
          className="w-full inline-flex items-center justify-center px-6 py-2 text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#FFD700] to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 group shadow-lg shadow-yellow-500/20 border border-yellow-600/30 transition-all duration-200"
          aria-label="Sign up for Annual Maintenance Contract package"
        >
          <span>Sign up for AMC Package</span>
          <ArrowRight 
            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" 
            aria-hidden="true"
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FirstTimeCustomerPanel;