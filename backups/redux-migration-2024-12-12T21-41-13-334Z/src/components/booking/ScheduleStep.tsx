/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the schedule step component that handles:
 * 1. Time slot selection and management
 * 2. Loading states during slot fetching
 * 3. Direct navigation to payment after slot selection
 * 4. Dynamic slot availability updates
 * 
 * Critical Features:
 * - Time slot selection interface
 * - Loading state management
 * - Automatic navigation flow
 * - Slot availability validation
 * 
 * Integration Points:
 * - Booking service for slot availability
 * - Navigation service for routing
 * - State management for booking flow
 * 
 * @ai-visual-protection: The time slot selection UI must remain consistent
 * @ai-flow-protection: The direct-to-payment navigation flow must be preserved
 * @ai-state-protection: The loading and selection states are optimized
 * 
 * Any modifications to this component could affect:
 * 1. Booking flow progression
 * 2. Time slot availability
 * 3. User experience during slot selection
 * 4. Payment process initiation
 * 
 * If changes are needed:
 * 1. Document the proposed changes
 * 2. Test the entire booking flow
 * 3. Verify loading states
 * 4. Ensure navigation remains smooth
 */

// @ai-visual-protection: This component's visual design and styling must be preserved exactly as is.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfDay, addMinutes, isFriday } from 'date-fns';
import { Calendar } from '../Calendar';
import { Loader2 } from 'lucide-react';
import { BUSINESS_RULES } from '../../constants/businessRules';
import styles from './ScheduleStep.module.css';

interface TimeSlot {
  time: string;
  available: boolean;
  isPeakHour: boolean;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  selectedAddressId: string;
  address: {
    address: string;
    postalCode: string;
    unitNumber: string;
  };
}

interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

interface ScheduleStepProps {
  customerInfo: CustomerInfo;
  selectedService: PricingOption;
  onScheduleSelect: (date: Date, timeSlot: string) => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ 
  customerInfo, 
  selectedService,
  onScheduleSelect 
}) => {
  console.log('ScheduleStep - Component mounted with:', { 
    customerInfo, 
    selectedService,
    customerAddress: customerInfo?.address,
    serviceTitle: selectedService?.title
  });
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startMinutes = BUSINESS_RULES.RECOMMENDED_HOURS.AMC.START * 60; // 9:30 AM
    const endMinutes = 17 * 60; // 5:00 PM
    
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += BUSINESS_RULES.BUFFER_TIME) {
      const time = addMinutes(date, minutes);
      const timeStr = format(time, 'HH:mm');
      const hour = Math.floor(minutes / 60);
      const isPeakHour = hour >= BUSINESS_RULES.PEAK_HOURS.START && 
                        hour < BUSINESS_RULES.PEAK_HOURS.END;

      slots.push({
        time: timeStr,
        available: true, // Will be updated by API
        isPeakHour
      });
    }
    return slots;
  };

  // Simulate fetching available time slots based on location
  useEffect(() => {
    console.log('ScheduleStep - Fetching slots for date:', selectedDate);
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const slots = generateTimeSlots(selectedDate);
        
        // Simulate availability based on location optimization
        const optimizedSlots = slots.map(slot => ({
          ...slot,
          available: Math.random() > (slot.isPeakHour ? 0.4 : 0.2) // Less availability during peak hours
        }));

        console.log('ScheduleStep - Slots generated:', optimizedSlots.length);
        setAvailableSlots(optimizedSlots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    console.log('ScheduleStep - Date selected:', date);
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = async (time: string) => {
    console.log('ScheduleStep - Time selected:', time);
    setSelectedTime(time);
    setIsLoading(true);
    
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Proceed immediately after selecting time
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hours, minutes);

      console.log('ScheduleStep - Proceeding with datetime:', scheduledDateTime);
      onScheduleSelect(scheduledDateTime, time);
    } catch (error) {
      console.error('Error processing time selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWeekendDay = (date: Date) => {
    return date.getDay() === 0; // Only Sundays are disabled
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.scheduleContainer}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`space-y-4 ${styles.calendarSection}`}>
          <h3 className="text-lg font-semibold text-white">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => isWeekendDay(date) || date < new Date()}
            className="rounded-md border border-gray-700 bg-gray-800"
          />
        </div>

        <div className={`space-y-4 ${styles.timeSection}`}>
          <h3 className="text-lg font-semibold text-white">Select Time</h3>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Processing your selection...</p>
              </div>
            </div>
          ) : (
            <div className={styles.timeSlotGrid}>
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available || isLoading}
                  className={`
                    p-3 rounded-md text-sm font-medium transition-colors
                    ${slot.available 
                      ? selectedTime === slot.time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {slot.time}
                  {slot.isPeakHour ? (
                    <span className="block text-xs text-yellow-500">Peak Hour</span>
                  ) : (
                    <span className="block text-xs text-green-500">Best Timing</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.tipContainer}>
        <h4 className="font-medium text-white">Scheduling Tips:</h4>
        <p className="text-sm text-gray-300 mb-3">
          Please note that scheduled time slots indicate the estimated service start time. Actual arrival times may vary based on service duration and traffic conditions.
        </p>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <div>
              <p>Morning slots: Non-peak hours (9:30 AM - 1 PM)</p>
              <p>Best time for punctual service</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <div>
              <p>Afternoon slots: Peak hours (2 PM - 6 PM)</p>
              <p>May experience delays due to high demand</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleStep;
