import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '../contexts/UserContext';

interface ServiceConfirmationProps {
  date: Date;
  time: string;
  isAMC?: boolean;
}

const ServiceConfirmation: React.FC<ServiceConfirmationProps> = ({
  date,
  time,
  isAMC,
}) => {
  const { user } = useUser();

  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>

      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div className="text-left">
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-medium">{format(date, 'MMMM d, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <div className="text-left">
              <p className="text-sm text-gray-400">Time</p>
              <p className="font-medium">{format(new Date(time), 'h:mm a')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-blue-400" />
            <div className="text-left">
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-medium">{user?.address || 'Your Registered Address'}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-gray-400">
        A confirmation email has been sent to your registered email address.
        {isAMC && " We'll remind you before your next service is due."}
      </p>
    </div>
  );
};

export default ServiceConfirmation;