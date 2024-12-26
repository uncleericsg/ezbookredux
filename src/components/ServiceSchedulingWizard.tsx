import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from '@components/Calendar';
import TimeSlotPicker from '@components/TimeSlotPicker';
import { useTimeSlots } from '@hooks/useTimeSlots';
import { useToast } from '@hooks/useToast';
import { RootState } from '@store';

interface ServiceSchedulingWizardProps {
  categoryId: string;
  onComplete: (date: Date, time: string) => Promise<void>;
  suggestedDate?: Date;
  isAMC?: boolean;
  price?: number;
}

const ServiceSchedulingWizard: React.FC<ServiceSchedulingWizardProps> = ({
  categoryId,
  onComplete,
  suggestedDate,
  isAMC,
  price,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(suggestedDate || null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { slots, loading: slotsLoading } = useTimeSlots(selectedDate, categoryId);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const toast = useToast();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.showError('Please select both date and time');
      return;
    }

    try {
      await onComplete(selectedDate, selectedTime);
    } catch (error) {
      toast.showError('Failed to schedule service');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              <span>Select Date</span>
            </div>
          </label>
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            suggestedDate={suggestedDate}
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
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full btn btn-primary mt-6 flex items-center justify-center space-x-2"
        >
          <span>Confirm Booking</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ServiceSchedulingWizard;