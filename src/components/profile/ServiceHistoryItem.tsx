import React from 'react';
import { Timer as Clock } from 'lucide-react';
import type { ServiceHistoryItemProps } from '@/types/service-history';
import { getStatusStyle, formatServiceDate } from '@/types/service-history';

export const ServiceHistoryItem: React.FC<ServiceHistoryItemProps> = ({ service }) => {
  return (
    <div 
      className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 border border-gray-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-gray-500/20"></div>
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white">{service.type}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(service.status)}`}>
              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            {formatServiceDate(service.date)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHistoryItem;