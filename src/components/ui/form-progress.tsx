import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface FormProgressProps {
  progress: number;
  timeRemaining: string;
  colorClass: string;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  progress,
  timeRemaining,
  colorClass
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Form Progress</span>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-gray-400">{timeRemaining}</span>
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-end mt-1">
        <span className={`text-sm font-medium ${colorClass}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
};
