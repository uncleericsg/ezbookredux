import axios from 'axios';
import { addMinutes } from 'date-fns';
import type { ServiceCategory, TimeSlot } from '@types';
import { validateSlotAllocation } from '@utils/bookingValidation';
import { BUSINESS_RULES } from '@constants/businessRules';
import { BookingError } from '@utils/errors';
import { toast } from 'sonner';

interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  categoryId: string;
  notes?: string;
  address?: string;
}

interface ExistingBooking {
  id: string;
  datetime: string;
  type: 'amc' | 'regular';
}

const getExistingBookings = async (date: Date): Promise<ExistingBooking[]> => {
  if (import.meta.env.DEV) {
    return [
      {
        id: '1',
        datetime: addMinutes(date, 120).toISOString(),
        type: 'regular'
      },
      {
        id: '2',
        datetime: addMinutes(date, 240).toISOString(),
        type: 'amc'
      }
    ];
  }

  try {
    const response = await axios.get('/api/bookings', {
      params: {
        date: date.toISOString().split('T')[0]
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch existing bookings:', error);
    return [];
  }
};

export const bookAppointment = async (datetime: string, details: BookingDetails): Promise<string> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'mock-appointment-id';
  }

  try {
    const response = await axios.post('/api/appointments', {
      datetime,
      ...details,
    });

    // Validate response
    if (!response.data?.id) {
      throw new Error('Invalid response from booking service');
    }

    return response.data.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        toast.error('This time slot is no longer available');
        throw new BookingError('This time slot is no longer available', 'SLOT_UNAVAILABLE');
      }
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
        throw new BookingError('Too many requests. Please try again later.', 'RATE_LIMIT', true);
      }
    }
    toast.error('Failed to book appointment');
    throw error;
  }
};

export const fetchAvailableSlots = async (
  date: Date, 
  categoryId: string, 
  signal?: AbortSignal,
  appointmentType?: AcuityAppointmentType
): Promise<TimeSlot[]> => {
  if (import.meta.env.DEV) {
    const slots: TimeSlot[] = [];
    const baseDate = new Date(date);
    baseDate.setHours(9, 30, 0, 0);
    const isFriday = date.getDay() === 5;
    const endHour = isFriday ? 16.5 : 17;
    const isAMC = categoryId === 'amc';
    const slotDuration = appointmentType?.duration || (isAMC ? 90 : 60);
    
    // Get current bookings count for the day
    const existingBookings = await getExistingBookings(date);
    const amcBookings = existingBookings.filter(b => b.type === 'amc').length;
    const regularBookings = existingBookings.filter(b => b.type === 'regular').length;
    const totalBookings = amcBookings + regularBookings;
    
    // Check slot availability
    if (totalBookings >= 6) return []; // Max 6 slots per day
    if (isAMC && amcBookings >= 3) return []; // Max 3 AMC slots
    if (!isAMC && regularBookings >= 4) return []; // Min 4 regular slots
    
    const maxSlots = isAMC ? (3 - amcBookings) : (6 - totalBookings);

    // Validate slot allocation
    const slotValidation = validateSlotAllocation(
      isAMC, 
      amcBookings, 
      regularBookings,
      BUSINESS_RULES.MAX_SLOTS_PER_DAY.TOTAL
    );
    
    if (!slotValidation.isValid) {
      return [];
    }

    // Generate slots
    for (let i = 0; i < maxSlots; i++) {
      const slotTime = addMinutes(baseDate, i * (isAMC ? 90 : 60)); // AMC: 90 mins, Regular: 60 mins
      const hour = slotTime.getHours();
      const minutes = slotTime.getMinutes();
      
      // Skip slots outside business hours
      if (hour < 9.5) continue;
      if (isFriday && (hour > 16 || (hour === 16 && minutes > 30))) continue;
      if (!isFriday && hour >= 17) continue;
      
      slots.push({
        id: `slot-${i}`,
        datetime: slotTime.toISOString(),
        available: Math.random() > 0.3,
        duration: slotDuration
      });
    }

    return slots;
  }

  try {
    const response = await axios.get('/api/slots', {
      params: {
        date: date.toISOString().split('T')[0],
        categoryId,
      },
      signal
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch available slots:', error);
    return [];
  }
};