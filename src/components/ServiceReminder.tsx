import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceReminderProps {
  nextServiceDate: string;
  onSchedule: () => void;
  isAMC?: boolean;
}

const ServiceReminder: React.FC<ServiceReminderProps> = ({
  nextServiceDate,
  onSchedule,
  isAMC = false,
}) => {
  const daysUntilService = Math.ceil(
    (new Date(nextServiceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilService <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-6 border ${
        isUrgent
          ? 'bg-red-500/10 border-red-500/20'
          : 'bg-blue-500/10 border-blue-500/20'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-2 rounded-lg ${
            isUrgent ? 'bg-red-500/20' : 'bg-blue-500/20'
          }`}
        >
          {isUrgent ? (
            <Bell className="h-6 w-6 text-red-400" />
          ) : (
            <Calendar className="h-6 w-6 text-blue-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {isUrgent ? 'Service Due Soon!' : 'Upcoming Service'}
          </h3>
          <p className="text-gray-400 mb-4">
            {isUrgent ? (
              <>Your service is due in {daysUntilService} days</>
            ) : (
              <>Next service is scheduled for {new Date(nextServiceDate).toLocaleDateString()}</>
            )}
          </p>

          <button
            onClick={onSchedule}
            className="btn btn-primary"
          >
            Schedule Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceReminder;