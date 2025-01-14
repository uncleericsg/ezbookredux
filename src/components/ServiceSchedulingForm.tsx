import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Calendar from '@components/Calendar';
import TimeSlotPicker from '@components/TimeSlotPicker';
import { useTimeSlots } from '@hooks/useTimeSlots';
import { useUser } from '@contexts/UserContext';

interface ServiceSchedulingFormProps {
  onSchedule: (date: Date, time: string) => Promise<void>;
  categoryId: string;
  loading?: boolean;
  price?: number;
  isAMC?: boolean;
}

const ServiceSchedulingForm: React.FC<ServiceSchedulingFormProps> = ({
  onSchedule,
  categoryId,
  loading,
  price,
  isAMC,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { slots, loading: slotsLoading } = useTimeSlots(selectedDate, categoryId);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    await onSchedule(selectedDate, selectedTime);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              <span>Select Date</span>
            </div>
          </label>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Select Time</span>
              </div>
            </label>
            <TimeSlotPicker
              slots={slots}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              loading={slotsLoading}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Booking Summary</h3>
        
        <div className="space-y-4">
          {selectedDate && (
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</p>
              </div>
            </div>
          )}

          {selectedTime && (
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="font-medium">
                  {format(new Date(selectedTime), 'h:mm a')}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-400 mt-1" />
            <div>
              <p className="text-sm text-gray-400">Service Location</p>
              <p className="font-medium">{user?.address || 'Your Registered Address'}</p>
            </div>
          </div>

          {price && !isAMC && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">Service Fee</p>
              <p className="text-2xl font-bold">${price}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedDate || !selectedTime || loading}
          className="w-full btn btn-primary mt-6"
        >
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
};

export default ServiceSchedulingForm;