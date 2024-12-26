import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';
import type { ServiceVisit } from '@types';
import ServiceRating from '@components/ServiceRating';
import { useServiceRating } from '@hooks/useServiceRating';

interface ServiceVisitTimelineProps {
  visits: ServiceVisit[];
  loading?: boolean;
}

const ServiceVisitTimeline: React.FC<ServiceVisitTimelineProps> = ({ visits, loading }) => {
  const [ratingVisit, setRatingVisit] = React.useState<string | null>(null);
  const { submitRating } = useServiceRating();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />

      <div className="space-y-6">
        {visits.map((visit) => (
          <div key={visit.id} className="relative pl-10">
            <div className="absolute left-0 p-2 rounded-full bg-gray-800 border border-gray-700">
              {visit.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : visit.status === 'scheduled' ? (
                <Clock className="h-5 w-5 text-blue-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between">
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
                  {visit.status === 'completed' && !visit.rating && (
                    <button
                      onClick={() => setRatingVisit(visit.id)}
                      className="mt-3 flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      <Star className="h-4 w-4" />
                      <span>Rate this service</span>
                    </button>
                  )}
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
          </div>
        ))}
        {ratingVisit && (
          <ServiceRating
            serviceId={ratingVisit}
            onSubmit={async (rating, feedback) => {
              await submitRating(ratingVisit, rating, feedback);
              setRatingVisit(null);
            }}
            onClose={() => setRatingVisit(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceVisitTimeline;