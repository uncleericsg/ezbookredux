import type { TimeSlot } from '@/types/timeSlot';
import { mapDatabaseTimeSlot, mapTimeSlotToDatabase } from '@/types/timeSlot';
import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import type { ErrorMetadata } from '@/types/error';

export async function getAvailableTimeSlots(
  date: string,
  serviceId: string
): Promise<TimeSlot[]> {
  try {
    const { data, error } = await supabaseClient
      .from('time_slots')
      .select('*')
      .eq('startTime', date)
      .eq('serviceId', serviceId)
      .eq('status', 'available')
      .order('startTime', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapDatabaseTimeSlot);
  } catch (error) {
    logger.error('Error fetching available time slots:', {
      message: error instanceof Error ? error.message : String(error),
      details: { date, serviceId }
    } satisfies ErrorMetadata);
    throw error;
  }
}

export async function reserveTimeSlot(
  slot: TimeSlot,
  bookingId: string
): Promise<TimeSlot> {
  try {
    const { data, error } = await supabaseClient
      .from('time_slots')
      .update({
        status: 'booked',
        isAvailable: false,
        bookingId: bookingId,
        updatedAt: new Date().toISOString()
      })
      .eq('id', slot.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    return mapDatabaseTimeSlot(data);
  } catch (error) {
    logger.error('Error reserving time slot:', {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id, bookingId }
    } satisfies ErrorMetadata);
    throw error;
  }
}

export async function releaseTimeSlot(slot: TimeSlot): Promise<TimeSlot> {
  try {
    const { data, error } = await supabaseClient
      .from('time_slots')
      .update({
        status: 'available',
        isAvailable: true,
        bookingId: null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', slot.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    return mapDatabaseTimeSlot(data);
  } catch (error) {
    logger.error('Error releasing time slot:', {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id }
    } satisfies ErrorMetadata);
    throw error;
  }
}

export async function generateTimeSlots(
  date: string,
  serviceId: string,
  duration: number
): Promise<TimeSlot[]> {
  try {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);

        const slot: TimeSlot = {
          id: `${date}-${hour}-${minute}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isAvailable: true,
          isPeakHour: hour >= 12 && hour <= 14,
          priceMultiplier: hour >= 12 && hour <= 14 ? 1.2 : 1,
          serviceId,
          technicianId: null,
          status: 'available',
          duration,
          blockReason: null,
          metadata: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        slots.push(slot);
      }
    }

    const { error } = await supabaseClient
      .from('time_slots')
      .insert(slots.map(mapTimeSlotToDatabase));

    if (error) throw error;
    return slots;
  } catch (error) {
    logger.error('Error generating time slots:', {
      message: error instanceof Error ? error.message : String(error),
      details: { date, serviceId }
    } satisfies ErrorMetadata);
    throw error;
  }
} 