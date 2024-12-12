import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { ServiceVisit } from '../types';

interface ServiceStatsProps {
  visits: ServiceVisit[];
  loading?: boolean;
}

const ServiceStats: React.FC<ServiceStatsProps> = ({ visits, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4" />
            <div className="h-6 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const completed = visits.filter(v => v.status === 'completed').length;
  const scheduled = visits.filter(v => v.status === 'scheduled').length;
  const cancelled = visits.filter(v => v.status === 'cancelled').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <h3 className="text-sm font-medium text-gray-400">Completed Services</h3>
        </div>
        <p className="text-2xl font-bold">{completed}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-medium text-gray-400">Upcoming Services</h3>
        </div>
        <p className="text-2xl font-bold">{scheduled}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <h3 className="text-sm font-medium text-gray-400">Cancelled Services</h3>
        </div>
        <p className="text-2xl font-bold">{cancelled}</p>
      </div>
    </div>
  );
};

export default ServiceStats;