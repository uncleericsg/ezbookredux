import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChemWashService } from '../types/chemwashserviceTypes';
import { chemwashServices } from '../data/chemwashServices';

const ChemWashServiceCard = lazy(() => import('./ChemWashServiceCard'));
const WAcard = lazy(() => import('./WAcard'));

const LoadingSkeleton = () => (
  <div className="rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
    <div className="h-10 bg-gray-700 rounded w-1/2 mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

const ChemWashServiceGrid = () => {
  return (
    <div>
      {/* Section Title with New Styling */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100
          }}
        >
          Chemical Wash Packages
        </motion.h2>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chemwashServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={<LoadingSkeleton />}>
              <ChemWashServiceCard service={service} />
            </Suspense>
          </motion.div>
        ))}
        {/* WhatsApp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<LoadingSkeleton />}>
            <WAcard />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
};

export default ChemWashServiceGrid;