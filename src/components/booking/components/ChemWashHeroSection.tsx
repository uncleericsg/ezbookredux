import { motion } from 'framer-motion';

const ChemWashHeroSection = () => {
  return (
    <div className="text-center mb-10 md:mb-20">
      <motion.h1 
        className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 md:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        PowerJet Chemical Wash
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl text-gray-300 mb-6 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        10x More Effective Than Traditional Cleaning Methods
      </motion.p>
      <motion.div 
        className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.p className="mb-3 md:mb-4">
          Our signature PowerJet service combines high-pressure cleaning with specialized coil chemicals to deeply clean and maintain your air conditioning system, ensuring optimal performance and energy efficiency.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChemWashHeroSection;