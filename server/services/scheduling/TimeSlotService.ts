import { supabaseClient } from '@server/config/supabase/client';
import { createApiError } from '@server/utils/apiResponse';
import { logger } from '@server/utils/logger';

interface TimeSlot {
	id: string;
	start_time: Date;
	end_time: Date;
	is_available: boolean;
	service_id: string;
	technician_id?: string;
}

interface CreateTimeSlotParams {
	start_time: Date;
	end_time: Date;
	service_id: string;
	technician_id?: string;
}

export class TimeSlotService {
	async createTimeSlot(params: CreateTimeSlotParams): Promise<TimeSlot> {
		try {
			const { data: timeSlot, error } = await supabaseClient
				.from('time_slots')
				.insert({
					start_time: params.start_time,
					end_time: params.end_time,
					service_id: params.service_id,
					technician_id: params.technician_id,
					is_available: true
				})
				.select()
				.single();

			if (error) throw error;
			if (!timeSlot) throw new Error('Failed to create time slot');

			return timeSlot;
		} catch (error) {
			logger.error('Create time slot error:', error);
			throw createApiError('Failed to create time slot', 'SERVER_ERROR');
		}
	}

	async getAvailableTimeSlots(
		serviceId: string,
		startDate: Date,
		endDate: Date
	): Promise<TimeSlot[]> {
		try {
			const { data: timeSlots, error } = await supabaseClient
				.from('time_slots')
				.select('*')
				.eq('service_id', serviceId)
				.eq('is_available', true)
				.gte('start_time', startDate.toISOString())
				.lte('end_time', endDate.toISOString())
				.order('start_time', { ascending: true });

			if (error) throw error;
			return timeSlots || [];
		} catch (error) {
			logger.error('Get available time slots error:', error);
			throw createApiError('Failed to fetch available time slots', 'SERVER_ERROR');
		}
	}

	async reserveTimeSlot(timeSlotId: string): Promise<TimeSlot> {
		try {
			const { data: timeSlot, error } = await supabaseClient
				.from('time_slots')
				.update({ is_available: false })
				.eq('id', timeSlotId)
				.select()
				.single();

			if (error) throw error;
			if (!timeSlot) throw createApiError('Time slot not found', 'NOT_FOUND');

			return timeSlot;
		} catch (error) {
			logger.error('Reserve time slot error:', error);
			throw createApiError('Failed to reserve time slot', 'SERVER_ERROR');
		}
	}

	async releaseTimeSlot(timeSlotId: string): Promise<TimeSlot> {
		try {
			const { data: timeSlot, error } = await supabaseClient
				.from('time_slots')
				.update({ is_available: true })
				.eq('id', timeSlotId)
				.select()
				.single();

			if (error) throw error;
			if (!timeSlot) throw createApiError('Time slot not found', 'NOT_FOUND');

			return timeSlot;
		} catch (error) {
			logger.error('Release time slot error:', error);
			throw createApiError('Failed to release time slot', 'SERVER_ERROR');
		}
	}
}

export const timeSlotService = new TimeSlotService();