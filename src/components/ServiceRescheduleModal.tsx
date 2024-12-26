import React, { useState } from 'react';
import { X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, addDays, isBefore } from 'date-fns';
import { useTimeSlots } from '@hooks/useTimeSlots';
import { useToast } from '@hooks/useToast';
import TimeSlotPicker from '@components/TimeSlotPicker';

interface ServiceRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDate: Date, newTime: string) => Promise<void>;
  currentDate: string;
  currentTime: string;
  categoryId: string;
}

const ServiceRescheduleModal: React.FC<ServiceRescheduleModalProps> = ({
  isOpen,
  onClose,
  onReschedule,
  currentDate,
  currentTime,
  categoryId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { slots, loading } = useTimeSlots(selectedDate, categoryId);
  const toast = useToast();

  if (!isOpen) return null;

  const currentDateTime = new Date(`${currentDate}T${currentTime}`);
  const cutoffDate = addDays(new Date(), 1);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.showError('Please select both date and time');
      return;
    }

    if (isBefore(currentDateTime, cutoffDate)) {
      toast.showError('Cannot reschedule appointments within 24 hours');
      return;
    }

    try {
      await onReschedule(selectedDate, selectedTime);
      onClose();
      toast.showSuccess('Appointment rescheduled successfully');
    } catch (error) {
      toast.showError('Failed to reschedule appointment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Reschedule Service</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
              <div>
                <p className="text-sm text-yellow-400">
                  Current Appointment:
                  <br />
                  {format(currentDateTime, 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span>New Date</span>
              </div>
            </label>
            <input
              type="date"
              min={format(cutoffDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span>New Time</span>
                </div>
              </label>
              <TimeSlotPicker
                slots={slots}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                loading={loading}
              />
            </div>
          )}

          <button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime}
            className="w-full btn btn-primary"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRescheduleModal;