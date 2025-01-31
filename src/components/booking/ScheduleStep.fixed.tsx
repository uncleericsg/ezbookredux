'use client';

// React and types
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';

// UI Components
import { Calendar } from '@/components/ui/Calendar';

// Styles
import styles from './ScheduleStep.module.css';

export type FC } from 'react';

export interface TimeSlot;

export interface CustomerInfo;

export interface PricingOption;

export interface ScheduleStepProps;

export interface RouteCache;


// Types

  available: boolean;
  isPeakHour: boolean;
  endTime?: string;
  isBufferTime?: boolean;
}

  lastName: string;
  email: string;
  mobile: string;
  selectedAddressId: string;
  address: string;
  postalCode: string;
  unitNumber: string;
}

  title: string;
  price: number;
  duration: number;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
  paddingBefore?: number;
  paddingAfter?: number;
}

  selectedService: PricingOption;
  onScheduleSelect: (date: Date, timeSlot: string, duration: number) => void;
}

const ScheduleStep: FC<ScheduleStepProps> = ({
  customerInfo,
  selectedService,
  onScheduleSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRouteCache = async (postalCode: string): Promise<RouteCache> => {
    try {
      const response = await window.fetch(`/api/route-cache/${postalCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch route cache');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching route cache: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching route cache');
    }
  };

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedDate || !customerInfo.postalCode) return;

      setIsLoading(true);
      setError(null);

      try {
        const routeCache = await getRouteCache(customerInfo.postalCode);
        // Process route cache and set time slots
        // This is a placeholder - implement actual time slot generation logic
        setTimeSlots([
          {
            time: '09:00',
            available: true,
            isPeakHour: false
          },
          {
            time: '10:00',
            available: true,
            isPeakHour: true
          }
        ]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load time slots');
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeSlots();
  }, [selectedDate, customerInfo.postalCode]);

  return (
    <div className={styles.scheduleStep}>
      <div className={styles.calendarSection}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < new Date()}
          className={styles.calendar}
        />
      </div>

      <div className={styles.timeSlotsSection}>
        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
            <p>Loading available time slots...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : timeSlots.length > 0 ? (
          <motion.div className={styles.timeSlotGrid}>
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                className={`${styles.timeSlot} ${!slot.available ? styles.unavailable : ''} ${
                  slot.isPeakHour ? styles.peakHour : ''
                }`}
                onClick={() => onScheduleSelect(selectedDate!, slot.time, selectedService.duration)}
              >
                {slot.time}
              </button>
            ))}
          </motion.div>
        ) : (
          <div className={styles.noSlots}>
            <p>No time slots available for the selected date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

undefined.displayName = 'undefined';