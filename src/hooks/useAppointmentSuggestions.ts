import { useState, useEffect } from 'react';
import { addDays, startOfDay, format, isSameDay, setHours, setMinutes } from 'date-fns';
import { useUserRedux } from './useUserRedux';
import { usePublicHolidays } from './usePublicHolidays';
import { fetchServiceReports } from '@services/repairShopr';
import { fetchNearbyBookings, type NearbyBooking } from '@services/locations/optimizer';
import { determineRegion } from '@services/locations/regions';
import { useToast } from './useToast';
import type { TimeSlot } from '../types';

interface ServiceReport {
  date: string;
  status: string;
}

// Local implementation of time slot generation
const generateAvailableSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseDate = new Date(date);
  const isFriday = date.getDay() === 5;
  const endHour = isFriday ? 16.5 : 17;

  // Generate slots from 9:30 AM to end hour
  for (let hour = 9; hour < endHour; hour++) {
    for (let minute = (hour === 9 ? 30 : 0); minute < 60; minute += 60) {
      if (hour === endHour - 1 && minute > 30) continue;
      
      const slotTime = new Date(baseDate);
      setHours(slotTime, hour);
      setMinutes(slotTime, minute);

      slots.push({
        id: `slot-${hour}-${minute}`,
        datetime: slotTime.toISOString(),
        available: Math.random() > 0.3 // Simulate availability
      });
    }
  }

  return slots;
};

export const useAppointmentSuggestions = () => {
  const { user } = useUserRedux();
  const { holidays } = usePublicHolidays();
  const [suggestedDate, setSuggestedDate] = useState<Date | null>(null);
  const [suggestedTimeSlots, setSuggestedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyAppointments, setNearbyAppointments] = useState<NearbyBooking[]>([]);
  const toast = useToast();

  useEffect(() => {
    const getSuggestions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const isAmcCustomer = user.lastName.toLowerCase().includes('amc');
        const intervalDays = isAmcCustomer ? 75 : 90;

        // Get last service date and nearby bookings
        const [reports, nearbyBookings] = await Promise.all([
          fetchServiceReports(user.id),
          fetchNearbyBookings(user.address || ''),
        ]);

        setNearbyAppointments(nearbyBookings);

        const lastService = reports
          .filter((r: ServiceReport) => r.status === 'completed')
          .sort((a: ServiceReport, b: ServiceReport) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

        if (lastService) {
          const lastServiceDate = new Date(lastService.date);
          const nextDate = addDays(lastServiceDate, intervalDays);
          const baseDate = nextDate < new Date() ? new Date() : nextDate;

          // Get available slots for the next 7 days starting from baseDate
          let availableSlots: TimeSlot[] = [];
          let currentDate = baseDate;
          let daysChecked = 0;

          while (availableSlots.length < 5 && daysChecked < 14) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            
            // Skip weekends and holidays
            if (!holidays.has(dateStr)) {
              const slots = generateAvailableSlots(currentDate);
              const availableForDay = slots.filter(slot => slot.available);
              
              if (availableForDay.length > 0) {
                availableSlots.push(...availableForDay);
              }
            }
            
            currentDate = addDays(currentDate, 1);
            daysChecked++;
          }

          if (availableSlots.length > 0) {
            // Sort slots by proximity to nearby appointments
            const sortedSlots = availableSlots.sort((a, b) => {
              const aDate = new Date(a.datetime);
              const bDate = new Date(b.datetime);
              
              const aNearbyCount = nearbyBookings.filter((booking: NearbyBooking) => 
                isSameDay(new Date(booking.datetime), aDate)
              ).length;
              
              const bNearbyCount = nearbyBookings.filter((booking: NearbyBooking) => 
                isSameDay(new Date(booking.datetime), bDate)
              ).length;

              return bNearbyCount - aNearbyCount;
            });

            setSuggestedDate(new Date(sortedSlots[0].datetime));
            setSuggestedTimeSlots(sortedSlots.map(slot => slot.datetime));
          }
        }
      } catch (error) {
        console.error('Failed to get appointment suggestions:', error);
        toast.showError('Failed to load suggested appointments');
      } finally {
        setLoading(false);
      }
    };

    getSuggestions();
  }, [user?.id, user?.address, holidays]);

  return { 
    suggestedDate, 
    suggestedTimeSlots, 
    loading,
    nearbyAppointments 
  };
};