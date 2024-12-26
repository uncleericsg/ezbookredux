import React from 'react';
import { Shield, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { User } from '@types';

interface AMCStatusCardProps {
  user: User;
  visitsCompleted: number;
  totalVisits: number;
  onSchedule?: () => void;
}

const AMCStatusCard: React.FC<AMCStatusCardProps> = ({
  user,
  visitsCompleted,
  totalVisits,
  onSchedule,
}) => {
  const visitsRemaining = totalVisits - visitsCompleted;
  const isLastVisit = visitsCompleted === 3;
  const isSecondToLast = visitsCompleted === 2;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">AMC Status</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            user.amcStatus === 'active'
              ? 'bg-green-500/10 text-green-400'
              : user.amcStatus === 'expired'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-yellow-500/10 text-yellow-400'
          }`}
        >
          {user.amcStatus.charAt(0).toUpperCase() + user.amcStatus.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-blue-400" />
          <div>
            <p className="text-sm text-gray-400">Service Visits</p>
            <p className="font-medium">
              {visitsCompleted} of {totalVisits} Used
            </p>
          </div>
        </div>

        {user.lastServiceDate && (
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Last Service</p>
              <p className="font-medium">
                {format(new Date(user.lastServiceDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        {user.nextServiceDate && (
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Next Service Due</p>
              <p className="font-medium">
                {format(new Date(user.nextServiceDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        )}
      </div>

      {(isLastVisit || isSecondToLast) && (
        <div className={`mt-4 p-4 rounded-lg border ${
          isLastVisit 
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
        }`}>
          <p>
            {isLastVisit
              ? 'This is your final AMC visit. Renew now to maintain continuous coverage and early renewal benefits.'
              : 'Your next service will be your final AMC visit. Please renew your package to continue enjoying AMC benefits.'}
          </p>
        </div>
      )}

      {visitsRemaining > 0 && onSchedule && (
        <button onClick={onSchedule} className="w-full btn btn-primary">
          Schedule Next Service
        </button>
      )}

      {visitsRemaining === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-400">
          <p>You have used all your service visits. Please renew your AMC package to continue enjoying the benefits.</p>
        </div>
      )}
    </div>
  );
};

export default AMCStatusCard;