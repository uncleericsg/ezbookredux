import { motion } from 'framer-motion';
import { ChemWashFeature } from '../types/chemwashserviceTypes';

interface ChemWashKeyFeaturesProps {
  features?: ChemWashFeature[];
}

const defaultFeatures: ChemWashFeature[] = [
  {
    title: 'Advanced Technology',
    description: 'Our proprietary PowerJet system uses high-pressure, precision cleaning to remove even the most stubborn contaminants.'
  },
  {
    title: 'Eco-Friendly',
    description: 'We use biodegradable, non-toxic cleaning solutions that are safe for your family and the environment.'
  },
  {
    title: 'Guaranteed Results',
    description: 'Backed by our 100% satisfaction guarantee and 1-year service warranty.'
  }
];

const ChemWashKeyFeatures = ({ features = defaultFeatures }: ChemWashKeyFeaturesProps) => {
  return (
    <div className="mt-20">
      <motion.h2 
        className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Why Choose PowerJet?
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2 + (index * 0.1),
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.h3 
              className="text-xl font-bold text-blue-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
            >
              {feature.title}
            </motion.h3>
            <p className="text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChemWashKeyFeatures;