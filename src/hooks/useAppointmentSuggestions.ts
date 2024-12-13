import { useState, useEffect } from 'react';
import { addDays, startOfDay, format, isSameDay } from 'date-fns';
import { useUserRedux } from './useUserRedux';
import { usePublicHolidays } from './usePublicHolidays';
import { fetchServiceReports } from '../services/repairShopr';
import { fetchNearbyBookings, determineRegion } from '../services/locations';
import { fetchAvailableSlots, fetchBlockedTimes } from '../services/acuity';
import { useToast } from './useToast';

export const useAppointmentSuggestions = () => {
  const { user } = useUserRedux();
  const { holidays } = usePublicHolidays();
  const [suggestedDate, setSuggestedDate] = useState<Date | null>(null);
  const [suggestedTimeSlots, setSuggestedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyAppointments, setNearbyAppointments] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const getSuggestions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const isAmcCustomer = user.lastName.toLowerCase().includes('amc');
        const intervalDays = isAmcCustomer ? 75 : 90;

        // Get blocked times for the next 120 days
        const today = startOfDay(new Date());
        const endDate = addDays(today, 100);
        const blockedTimes = await fetchBlockedTimes(today, endDate);

        // Get last service date and nearby bookings
        const [reports, nearbyBookings] = await Promise.all([
          fetchServiceReports(user.id),
          fetchNearbyBookings(user.address || ''),
        ]);

        setNearbyAppointments(nearbyBookings);

        const lastService = reports
          .filter(r => r.status === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (lastService) {
          const lastServiceDate = new Date(lastService.date);
          const nextDate = addDays(lastServiceDate, intervalDays);
          const baseDate = nextDate < today ? today : nextDate;

          // Get available slots for the next 7 days starting from baseDate
          let availableSlots = [];
          let currentDate = baseDate;
          let daysChecked = 0;

          while (availableSlots.length < 5 && daysChecked < 14) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            
            // Skip weekends and holidays
            if (!holidays.has(dateStr)) {
              const slots = await fetchAvailableSlots(currentDate, '');
              
              // Filter out blocked times
              const filteredSlots = slots.filter(slot => {
                const slotTime = new Date(slot.datetime);
                return !blockedTimes.some(block => {
                  const blockStart = new Date(block.start);
                  const blockEnd = new Date(block.end);
                  return slotTime >= blockStart && slotTime <= blockEnd;
                });
              });

              if (filteredSlots.length > 0) {
                availableSlots.push(...filteredSlots);
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
              
              const aNearbyCount = nearbyBookings.filter(booking => 
                isSameDay(new Date(booking.datetime), aDate)
              ).length;
              
              const bNearbyCount = nearbyBookings.filter(booking => 
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