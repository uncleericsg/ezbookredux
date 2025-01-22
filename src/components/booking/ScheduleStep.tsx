import React, { useState } from 'react';
import { toast } from 'sonner';
import { HiOutlineCalendarDays, HiOutlineClock } from 'react-icons/hi2';
import type { BaseStepProps } from '@/types/booking-flow';
import type { PickerTimeSlot } from '@/types/schedule';
import { Calendar } from '../ui/calendar';
import { TimeSlotPicker } from '../ui/time-slot-picker';
import { formatDate, formatTime } from '@/utils/dates';

const ScheduleStep: React.FC<BaseStepProps> = ({
  onNext,
  onBack,
  bookingData,
  onUpdateBookingData,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    bookingData.date ? new Date(bookingData.date) : null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<PickerTimeSlot | undefined>(
    bookingData.time ? {
      id: '1',
      startTime: bookingData.time,
      isAvailable: true
    } : undefined
  );

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onUpdateBookingData({
        ...bookingData,
        date: date.toISOString()
      });
    }
  };

  const handleTimeSlotSelect = (slot: PickerTimeSlot) => {
    setSelectedTimeSlot(slot);
    if (selectedDate) {
      onUpdateBookingData({
        ...bookingData,
        time: slot.startTime
      });
    }
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    onNext();
  };

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Date Selection */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <HiOutlineCalendarDays className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-white">
              Select Date
            </h2>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border border-gray-700"
            disabled={(date) => date < new Date()}
          />
        </div>

        {/* Time Slot Selection */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <HiOutlineClock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-white">
              Select Time
            </h2>
          </div>
          {selectedDate ? (
            <TimeSlotPicker
              slots={[
                { id: '1', startTime: '09:00', endTime: '10:00', isAvailable: true },
                { id: '2', startTime: '10:00', endTime: '11:00', isAvailable: true },
                { id: '3', startTime: '11:00', endTime: '12:00', isAvailable: true },
                { id: '4', startTime: '14:00', endTime: '15:00', isAvailable: true, isPeakHour: true },
                { id: '5', startTime: '15:00', endTime: '16:00', isAvailable: true, isPeakHour: true },
                { id: '6', startTime: '16:00', endTime: '17:00', isAvailable: true }
              ]}
              selectedSlot={selectedTimeSlot}
              onSelectSlot={handleTimeSlotSelect}
            />
          ) : (
            <p className="text-gray-400">
              Please select a date first
            </p>
          )}
        </div>

        {/* Selected Schedule Summary */}
        {selectedDate && selectedTimeSlot && (
          <div className="bg-gray-800/90 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Selected Schedule
            </h3>
            <div className="text-gray-300">
              <p>Date: {formatDate(selectedDate)}</p>
              <p>Time: {formatTime(selectedTimeSlot.startTime)}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

ScheduleStep.displayName = 'ScheduleStep';

export default ScheduleStep;
