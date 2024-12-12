import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Calendar } from '../Calendar';
import { format, addMinutes, startOfDay } from 'date-fns';
import { CustomerInfo, PricingOption, TimeSlot } from '../../types/booking';
import { BUSINESS_RULES } from '../../constants/businessRules';
import styles from './ScheduleStep.module.css';

interface ReturnCustomerScheduleProps {
  customerInfo: CustomerInfo;
  selectedService: PricingOption;
  onScheduleSelect: (date: Date, timeSlot: string) => void;
  onBack: () => void;
}

const ReturnCustomerSchedule: React.FC<ReturnCustomerScheduleProps> = ({
  customerInfo,
  selectedService,
  onScheduleSelect,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startMinutes = BUSINESS_RULES.RECOMMENDED_HOURS.AMC.START * 60;
    const endMinutes = 17 * 60;
    
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += BUSINESS_RULES.BUFFER_TIME) {
      const time = addMinutes(date, minutes);
      const timeStr = format(time, 'HH:mm');
      const hour = Math.floor(minutes / 60);
      const isPeakHour = hour >= BUSINESS_RULES.PEAK_HOURS.START && 
                        hour < BUSINESS_RULES.PEAK_HOURS.END;

      slots.push({
        time: timeStr,
        available: true,
        isPeakHour
      });
    }
    return slots;
  };

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const slots = generateTimeSlots(selectedDate);
        
        const optimizedSlots = slots.map(slot => ({
          ...slot,
          available: Math.random() > (slot.isPeakHour ? 0.4 : 0.2)
        }));

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
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = async (time: string) => {
    setSelectedTime(time);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hours, minutes);
      onScheduleSelect(scheduledDateTime, time);
    } catch (error) {
      console.error('Error processing time selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWeekendDay = (date: Date) => {
    return date.getDay() === 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto space-y-6 p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Schedule Service</h2>
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/70 p-6 rounded-lg shadow-xl backdrop-blur-sm">
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
      </div>
    </motion.div>
  );
};

export default ReturnCustomerSchedule;
