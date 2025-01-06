import React, { useState } from 'react';
import { format, addMinutes } from 'date-fns';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import type { AppointmentType } from '../types';

interface ServiceSummaryProps {
  date: Date;
  time: string;
  appointmentType: AppointmentType | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  address?: string;
  price?: number;
  isAMC?: boolean;
  disabled?: boolean;
}

const ServiceSummary: React.FC<ServiceSummaryProps> = ({
  date,
  time,
  appointmentType,
  onConfirm,
  loading,
  address = 'Your Registered Address',
  price,
  isAMC = false,
  disabled = false,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const endTime = addMinutes(new Date(time), appointmentType?.duration || 60);

  const handleConfirm = async () => {
    if (isConfirming || disabled || loading) return;
    
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Service Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-blue-400 mt-1" />
          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-medium">{format(date, 'MMMM d, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-400 mt-1" />
          <div>
            <p className="text-sm text-gray-400">Time</p>
            <p className="font-medium">
              {format(new Date(time), 'h:mm a')} - {format(endTime, 'h:mm a')}
              <span className="text-sm text-gray-400 ml-2">
                ({appointmentType?.duration || 60} mins)
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-400 mt-1" />
          <div>
            <p className="text-sm text-gray-400">Location</p>
            <p className="font-medium">
              {address}
            </p>
          </div>
        </div>

        {price && !isAMC && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">Service Fee</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">
                ${price}
                {appointmentType && (
                  <span className="text-sm text-gray-400 ml-2">
                    ({appointmentType.duration} mins)
                  </span>
                )}
              </p>
              {isAMC && <span className="text-sm text-green-400">(Included in AMC)</span>}
            </div>
          </div>
        )}
        
        {isAMC && (
          <div className="mt-4 bg-blue-500/10 text-blue-400 p-4 rounded-lg text-sm">
            This service is covered under your active AMC package
          </div>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading || disabled || isConfirming}
        className="w-full btn btn-primary flex items-center justify-center space-x-2"
      >
        {(loading || isConfirming) ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Confirming...</span>
          </>
        ) : (
          <span>Confirm Booking</span>
        )}
      </button>
      {disabled && (
        <p className="text-sm text-gray-400 text-center mt-2">
          Please select a valid date and time to continue
        </p>
      )}
    </div>
  );
};

export default ServiceSummary;