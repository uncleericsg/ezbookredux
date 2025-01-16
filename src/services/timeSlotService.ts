import { createClient } from '@supabase/supabase-js';
import { TimeSlot, GetTimeSlotsRequest, TimeSlotConfig } from '../types/timeSlot';
import { createApiError } from '../utils/apiResponse';
import { Database } from '../types/supabase';
import { addDays, addHours, setHours, startOfDay, endOfDay, eachHourOfInterval } from 'date-fns';

export class TimeSlotService {
  private supabase;
  private config: TimeSlotConfig = {
    peak_hours_start: 17,  // 5 PM
    peak_hours_end: 21,    // 9 PM
    peak_price_multiplier: 1.2,
    min_booking_notice_hours: 2,
    max_advance_booking_days: 30,
    working_hours_start: 9, // 9 AM
    working_hours_end: 21   // 9 PM
  };

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  async getAvailableTimeSlots(params: GetTimeSlotsRequest): Promise<TimeSlot[]> {
    try {
      // Get service details for duration
      const { data: service, error: serviceError } = await this.supabase
        .from('services')
        .select('duration_minutes, padding_before_minutes, padding_after_minutes')
        .eq('id', params.service_id)
        .single();

      if (serviceError || !service) {
        throw createApiError('Service not found', 'NOT_FOUND');
      }

      // Get existing bookings for the date
      const date = new Date(params.date);
      const { data: bookings, error: bookingsError } = await this.supabase
        .from('bookings')
        .select('scheduled_start, scheduled_end, padding_start, padding_end')
        .gte('scheduled_start', startOfDay(date).toISOString())
        .lte('scheduled_end', endOfDay(date).toISOString())
        .not('status', 'eq', 'cancelled');

      if (bookingsError) throw bookingsError;

      // Generate all possible time slots
      const slots = this.generateTimeSlots(
        date,
        service.duration_minutes,
        service.padding_before_minutes,
        service.padding_after_minutes
      );

      // Mark slots as unavailable based on existing bookings
      return this.markUnavailableSlots(slots, bookings || []);
    } catch (error) {
      console.error('Get available time slots error:', error);
      throw createApiError('Failed to fetch time slots', 'SERVER_ERROR');
    }
  }

  private generateTimeSlots(
    date: Date,
    duration: number,
    paddingBefore: number,
    paddingAfter: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startTime = setHours(date, this.config.working_hours_start);
    const endTime = setHours(date, this.config.working_hours_end);
    
    // Minimum start time based on notice period
    const minStartTime = addHours(new Date(), this.config.min_booking_notice_hours);
    
    // Maximum bookable date
    const maxDate = addDays(new Date(), this.config.max_advance_booking_days);

    // If date is beyond max allowed date, return empty slots
    if (date > maxDate) return slots;

    // Generate slots for each hour
    const hours = eachHourOfInterval({ start: startTime, end: endTime });
    
    for (const hour of hours) {
      // Skip if before minimum notice period
      if (hour < minStartTime) continue;

      const hourNum = hour.getHours();
      const isPeakHour = hourNum >= this.config.peak_hours_start && 
                        hourNum <= this.config.peak_hours_end;

      slots.push({
        start_time: hour.toISOString(),
        end_time: addHours(hour, Math.ceil(duration / 60)).toISOString(),
        is_available: true,
        is_peak_hour: isPeakHour,
        price_multiplier: isPeakHour ? this.config.peak_price_multiplier : 1,
        service_id: params.service_id
      });
    }

    return slots;
  }

  private markUnavailableSlots(slots: TimeSlot[], bookings: any[]): TimeSlot[] {
    return slots.map(slot => {
      const slotStart = new Date(slot.start_time);
      const slotEnd = new Date(slot.end_time);

      // Check if slot overlaps with any booking
      const isUnavailable = bookings.some(booking => {
        const bookingStart = new Date(booking.padding_start);
        const bookingEnd = new Date(booking.padding_end);
        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      return {
        ...slot,
        is_available: !isUnavailable
      };
    });
  }
} 