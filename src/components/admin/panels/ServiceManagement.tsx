import React from 'react';
import { motion } from 'framer-motion';
import ServiceHub from '../ServiceHub/ServiceHub';

const ServiceManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <ServiceHub />
    </motion.div>
  );
};

export default ServiceManagement;
