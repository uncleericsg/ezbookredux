import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { ServiceVisit } from '@types';
import { useServiceHistory } from '@hooks/useServiceHistory';

interface ServiceHistoryProps {
  userId?: string;
  limit?: number;
}

const ServiceHistory: React.FC<ServiceHistoryProps> = ({ userId, limit }) => {
  const { visits, loading } = useServiceHistory(userId || '');

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const displayedVisits = limit ? visits.slice(0, limit) : visits;

  if (displayedVisits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No service history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedVisits.map((visit) => (
        <div
          key={visit.id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {visit.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
              ) : visit.status === 'scheduled' ? (
                <Clock className="h-5 w-5 text-blue-400 mt-1" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 mt-1" />
              )}
              <div>
                <h4 className="font-medium">{visit.label}</h4>
                <p className="text-sm text-gray-400">
                  {format(new Date(visit.date), 'PPP')}
                </p>
                {visit.technician && (
                  <p className="text-sm text-gray-400 mt-1">
                    Technician: {visit.technician}
                  </p>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                visit.status === 'completed'
                  ? 'bg-green-500/10 text-green-400'
                  : visit.status === 'scheduled'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
            </span>
          </div>
          {visit.notes && (
            <p className="mt-3 text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg">
              {visit.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceHistory;