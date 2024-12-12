import React from 'react';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Key Metrics</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Last 7 Days
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Last 30 Days
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Bookings', 'Revenue', 'Users', 'Conversion'].map((metric) => (
              <div key={metric} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-gray-400 text-sm">{metric}</h4>
                <p className="text-2xl font-semibold mt-2">0</p>
              </div>
            ))}
          </div>
          <div className="border border-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Analytics charts will be implemented here.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
