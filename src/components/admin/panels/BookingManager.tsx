import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const BookingManager = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Booking Manager</h2>
      </div>
      {/* Your existing booking management content */}
    </motion.div>
  );
};

export default BookingManager;
