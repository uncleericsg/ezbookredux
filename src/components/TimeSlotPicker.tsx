import { useMemo, useCallback } from 'react';
import { format, isBefore, isAfter, addMinutes } from 'date-fns';
import { Clock, Loader2 } from 'lucide-react';
import type { TimeSlot, AppointmentType } from '../types';
import { BUSINESS_RULES } from '../constants/businessRules';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  loading?: boolean;
  disabled?: boolean;
  isAMC: boolean;
  appointmentType?: AppointmentType;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedTime,
  onTimeSelect,
  loading,
  isAMC = false,
  disabled = false,
  appointmentType,
}) => {
  const currentTime = new Date();
  const bufferTime = addMinutes(currentTime, 30);
  const duration = useMemo(() => {
    if (appointmentType?.duration) return appointmentType.duration;
    return isAMC ? BUSINESS_RULES.SLOT_DURATION.AMC : BUSINESS_RULES.SLOT_DURATION.REGULAR;
  }, [appointmentType, isAMC]);

  const isSlotAvailable = useCallback((slot: TimeSlot) => {
    const slotTime = new Date(slot.datetime);
    if (!slot.available) return false;
    if (disabled) return false;
    
    const hour = slotTime.getHours();
    const timeValue = hour + (slotTime.getMinutes() / 60);
    const isFriday = slotTime.getDay() === 5;
    
    if (timeValue < BUSINESS_RULES.BUSINESS_START_HOUR.START) {
      return false;
    }
    
    if (isFriday && timeValue >= 16.5) { // 4:30 PM for Fridays
      return false;
    }
    
    if (!isFriday && timeValue >= 17) { // 5:00 PM for other days
      return false;
    }
    
    // For same-day bookings, ensure slot is at least 30 minutes in the future
    if (slotTime.toDateString() === currentTime.toDateString()) {
      return isAfter(slotTime, bufferTime);
    }
    
    return true;
  }, [disabled, currentTime, bufferTime, isAMC]);

  const getSlotRecommendation = (slot: TimeSlot) => {
    const slotTime = new Date(slot.datetime);
    const hour = slotTime.getHours();
    const minutes = slotTime.getMinutes();
    const timeValue = hour + (minutes / 60);
    
    // AMC recommendations
    if (isAMC) {
      if (timeValue >= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.START && 
          timeValue <= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.END) {
        return BUSINESS_RULES.RECOMMENDED_HOURS.AMC.MESSAGE;
      }
    }
    
    // Warning for peak hours (3 PM - 5 PM)
    if (hour >= BUSINESS_RULES.PEAK_HOURS.START && hour <= BUSINESS_RULES.PEAK_HOURS.END) {
      return BUSINESS_RULES.PEAK_HOURS.WARNING;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
        No time slots available for the selected date.
      </div>
    );
  }

  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning = slots.filter(slot => {
      const hour = new Date(slot.datetime).getHours();
      return hour < 12;
    });

    const afternoon = slots.filter(slot => {
      const hour = new Date(slot.datetime).getHours();
      return hour >= 12;
    });

    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [slots]);

  const SlotGroup = ({ title, groupSlots }: { title: string; groupSlots: TimeSlot[] }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400 flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>{title}</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {groupSlots.map((slot) => {
          const slotTime = new Date(slot.datetime);
          const isAvailable = isSlotAvailable(slot);
          const recommendation = getSlotRecommendation(slot);
          const hour = slotTime.getHours();
          const isPeakHour = hour >= BUSINESS_RULES.PEAK_HOURS.START && 
                            hour <= BUSINESS_RULES.PEAK_HOURS.END;
          const isRecommendedTime = isAMC && 
                                   hour >= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.START &&
                                   hour <= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.END;
          return (
            <div key={slot.id} className="flex flex-col items-center">
              <button
                onClick={() => isAvailable && onTimeSelect(slot.datetime)}
                disabled={!isAvailable}
                className={`
                  w-full flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200
                  ${selectedTime === slot.datetime
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800'
                    : isAvailable 
                    ? 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">{format(slotTime, 'h:mm a')}</span>
                  {duration && (
                    <span className="text-xs opacity-75">
                      ({duration} mins)
                    </span>
                  )}
                </div>
              </button>
              {isAvailable && recommendation && (
                <div className={`text-xs px-2 py-1 mt-1 rounded text-center
                  ${isRecommendedTime ? 'text-green-400' : 
                    isPeakHour ? 'text-yellow-400' : 
                    'text-blue-400'}`}>
                  {recommendation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {morningSlots.length > 0 && (
        <SlotGroup title="Morning" groupSlots={morningSlots} />
      )}
      {afternoonSlots.length > 0 && (
        <SlotGroup title="Afternoon" groupSlots={afternoonSlots} />
      )}
    </div>
  );
};

export default TimeSlotPicker;