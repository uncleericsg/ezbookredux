import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type {
  TimeSlot,
  CreateTimeSlotParams,
  TimeSlotService as ITimeSlotService,
  DatabaseTimeSlot
} from '@shared/types/scheduling';

export class TimeSlotService implements ITimeSlotService {
  async createTimeSlot(params: CreateTimeSlotParams): Promise<TimeSlot> {
    try {
      logger.info('Creating time slot', { params });

      // Validate time range
      if (params.end_time <= params.start_time) {
        logger.warn('Invalid time range', { params });
        throw ApiError.validation('End time must be after start time');
      }

      // Check for overlapping time slots
      const { data: existingSlots } = await supabaseAdmin
        .from('time_slots')
        .select('*')
        .eq('service_id', params.service_id)
        .or(`start_time.lte.${params.end_time.toISOString()},end_time.gte.${params.start_time.toISOString()}`);

      if (existingSlots?.length) {
        logger.warn('Overlapping time slots found', { 
          params,
          existingSlots: existingSlots.length 
        });
        throw ApiError.validation('Time slot overlaps with existing slots');
      }

      // Create time slot
      const { data: timeSlot, error } = await supabaseAdmin
        .from('time_slots')
        .insert({
          start_time: params.start_time.toISOString(),
          end_time: params.end_time.toISOString(),
          service_id: params.service_id,
          technician_id: params.technician_id,
          is_available: true
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating time slot', { error, params });
        throw ApiError.database('Failed to create time slot', error);
      }

      if (!timeSlot) {
        logger.error('Failed to create time slot - no slot returned', { params });
        throw ApiError.database('Failed to create time slot');
      }

      logger.info('Time slot created successfully', { timeSlotId: timeSlot.id });
      return this.mapTimeSlot(timeSlot as DatabaseTimeSlot);
    } catch (error) {
      logger.error('Create time slot error', { error: String(error), params });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to create time slot');
    }
  }

  async getAvailableTimeSlots(
    serviceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSlot[]> {
    try {
      logger.info('Fetching available time slots', { 
        serviceId,
        startDate,
        endDate 
      });

      const { data: timeSlots, error } = await supabaseAdmin
        .from('time_slots')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_available', true)
        .gte('start_time', startDate.toISOString())
        .lte('end_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        logger.error('Database error fetching time slots', { error, serviceId });
        throw ApiError.database('Failed to fetch available time slots', error);
      }

      logger.info('Time slots fetched successfully', { count: timeSlots?.length || 0 });
      return (timeSlots || []).map(slot => this.mapTimeSlot(slot as DatabaseTimeSlot));
    } catch (error) {
      logger.error('Get available time slots error', { 
        error: String(error),
        serviceId,
        startDate,
        endDate 
      });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch available time slots');
    }
  }

  async reserveTimeSlot(timeSlotId: string): Promise<TimeSlot> {
    try {
      logger.info('Reserving time slot', { timeSlotId });

      const { data: timeSlot, error } = await supabaseAdmin
        .from('time_slots')
        .update({ is_available: false })
        .eq('id', timeSlotId)
        .select()
        .single();

      if (error) {
        logger.error('Database error reserving time slot', { error, timeSlotId });
        throw ApiError.database('Failed to reserve time slot', error);
      }

      if (!timeSlot) {
        logger.warn('Time slot not found', { timeSlotId });
        throw ApiError.notFound('Time slot', timeSlotId);
      }

      logger.info('Time slot reserved successfully', { timeSlotId });
      return this.mapTimeSlot(timeSlot as DatabaseTimeSlot);
    } catch (error) {
      logger.error('Reserve time slot error', { error: String(error), timeSlotId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to reserve time slot');
    }
  }

  async releaseTimeSlot(timeSlotId: string): Promise<TimeSlot> {
    try {
      logger.info('Releasing time slot', { timeSlotId });

      const { data: timeSlot, error } = await supabaseAdmin
        .from('time_slots')
        .update({ is_available: true })
        .eq('id', timeSlotId)
        .select()
        .single();

      if (error) {
        logger.error('Database error releasing time slot', { error, timeSlotId });
        throw ApiError.database('Failed to release time slot', error);
      }

      if (!timeSlot) {
        logger.warn('Time slot not found', { timeSlotId });
        throw ApiError.notFound('Time slot', timeSlotId);
      }

      logger.info('Time slot released successfully', { timeSlotId });
      return this.mapTimeSlot(timeSlot as DatabaseTimeSlot);
    } catch (error) {
      logger.error('Release time slot error', { error: String(error), timeSlotId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to release time slot');
    }
  }

  private mapTimeSlot(slot: DatabaseTimeSlot): TimeSlot {
    return {
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available,
      service_id: slot.service_id,
      technician_id: slot.technician_id,
      created_at: slot.created_at,
      updated_at: slot.updated_at
    };
  }
}

export const timeSlotService = new TimeSlotService();
