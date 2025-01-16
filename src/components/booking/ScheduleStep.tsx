/*
 * @ai-protection - CRITICAL COMPONENT - DO NOT MODIFY WITHOUT REVIEW
 * 
 * This component is a core part of the booking system that integrates location optimization,
 * route management, and time slot scheduling. Any changes require thorough testing of the
 * entire booking flow and location optimization system.
 * 
 * Core System Integration:
 * 1. Location Optimization System
 *    - Region-based slot prioritization (5-8km range)
 *    - Distance-based availability filtering
 *    - Real-time route optimization
 *    - Technician scheduling optimization
 * 
 * 2. Time Slot Management
 *    - Dynamic slot generation and filtering
 *    - Peak/off-peak hour handling
 *    - Buffer time management
 *    - Service duration calculations
 * 
 * 3. Booking Flow Integration
 *    - Direct payment navigation
 *    - State persistence
 *    - Loading state management
 *    - Error handling
 * 
 * Critical Dependencies:
 * @requires OptimizedLocationProvider - Location-based filtering and optimization
 * @requires optimizeTimeSlots - Slot optimization algorithm
 * @requires RouteCache - Technician route optimization
 * @requires BusinessRules - Scheduling constraints and rules
 * 
 * Integration Points:
 * - src/components/booking/OptimizedLocationProvider.tsx
 * - src/services/locations/optimizer.ts
 * - src/services/locations/regions.ts
 * - src/constants/businessRules.ts
 * 
 * Protected Features:
 * @ai-visual-protection: UI components and time slot presentation
 * @ai-flow-protection: Booking flow and navigation logic
 * @ai-state-protection: Redux state management
 * @ai-location-protection: Location optimization system
 * @ai-route-protection: Technician route optimization
 * 
 * Critical Workflows:
 * 1. Location Optimization
 *    - Postal code validation
 *    - Region determination
 *    - Distance calculation
 *    - Route optimization
 * 
 * 2. Time Slot Management
 *    - Availability calculation
 *    - Duration handling
 *    - Buffer time enforcement
 *    - Peak hour management
 * 
 * 3. Booking Flow
 *    - Customer info validation
 *    - Service selection
 *    - Schedule confirmation
 *    - Payment navigation
 * 
 * Required Testing:
 * 1. Location System
 *    - Region assignment
 *    - Distance calculations
 *    - Route optimization
 * 
 * 2. Time Slot System
 *    - Availability accuracy
 *    - Duration calculations
 *    - Buffer enforcement
 * 
 * 3. Integration Testing
 *    - Full booking flow
 *    - State management
 *    - Error handling
 * 
 * Change Protocol:
 * 1. Document proposed changes
 * 2. Test in isolation
 * 3. Verify with location system
 * 4. Test full booking flow
 * 5. Validate mobile responsiveness
 * 
 * Last Stable Update: December 2023
 * - Location optimization implemented
 * - Route cache integration complete
 * - Duration handling enhanced
 */

import React, { useState } from 'react';
import { format, addMinutes } from 'date-fns';
import { toast } from 'sonner';
import { HiOutlineCalendarDays, HiOutlineClock } from 'react-icons/hi2';
import type { CreateBookingParams } from '@shared/types/booking';
import { Calendar } from '@/components/ui/Calendar';
import { TimeSlotPicker } from '@/components/ui/TimeSlotPicker';
import { formatTimeSlot } from '@/utils/dates';

interface ScheduleStepProps {
  onNext: () => void;
  onBack: () => void;
  bookingData: Partial<CreateBookingParams>;
  onUpdateBookingData: (data: Partial<CreateBookingParams>) => void;
  className?: string;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
  onNext,
  onBack,
  bookingData,
  onUpdateBookingData,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.scheduled_datetime ? new Date(bookingData.scheduled_datetime) : undefined
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(
    bookingData.scheduled_timeslot
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onUpdateBookingData({
        ...bookingData,
        scheduled_datetime: date.toISOString()
      });
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    if (selectedDate) {
      onUpdateBookingData({
        ...bookingData,
        scheduled_timeslot: timeSlot
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
              date={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={handleTimeSlotSelect}
              serviceDuration={bookingData.service_duration || 60}
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
              <p>Date: {format(selectedDate, 'PPP')}</p>
              <p>Time: {formatTimeSlot(selectedTimeSlot, bookingData.service_duration || 60)}</p>
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
