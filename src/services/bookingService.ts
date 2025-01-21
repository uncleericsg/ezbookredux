import type {
  Booking,
  BookingStatus,
  BookingFilters,
  CreateBookingInput,
  UpdateBookingInput,
  BookingWithService
} from '@shared/types/booking';
import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/utils/logger';
import type { AsyncServiceResponse, ServiceResponse } from '../../types/api';
import { BaseService } from './base';
import { 
  ValidationFailedError,
  DatabaseOperationError,
  NotFoundError
} from '../../shared/types/error';
import type { ValidationError } from '../../shared/types/error';

export class BookingService extends BaseService {
  private validateBookingData(data: Partial<CreateBookingInput>): void {
    const requiredFields = ['customerId', 'serviceId', 'date', 'time', 'duration', 'location'];
    const missingFields = requiredFields.filter(
      field => !data[field as keyof CreateBookingInput]
    );
    
    if (missingFields.length > 0) {
      throw new ValidationFailedError([{
        field: 'booking',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        type: 'required',
        code: 'VALIDATION_ERROR'
      }]);
    }
  }

  async createBooking(data: CreateBookingInput): Promise<ServiceResponse<Booking>> {
    return this.handleRequest(async () => {
      this.validateBookingData(data);

      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .insert({
          ...data,
          status: 'pending' as BookingStatus,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseOperationError('create', { error });
      }

      if (!booking) {
        throw new DatabaseOperationError('create', { message: 'No booking returned after creation' });
      }

      return booking;
    }, { path: 'booking/create' });
  }

  async updateBooking(
    id: string, 
    data: UpdateBookingInput
  ): Promise<ServiceResponse<Booking>> {
    return this.handleRequest(async () => {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DatabaseOperationError(
          'update_booking',
          { code: error.code }
        );
      }

      if (!booking) {
        throw new NotFoundError('Booking');
      }

      return booking;
    }, { path: `booking/update/${id}` });
  }

  async getBookings(
    filters?: BookingFilters
  ): Promise<ServiceResponse<BookingWithService[]>> {
    return this.handleRequest(async () => {
      let query = supabaseClient
        .from('bookings')
        .select(`
          *,
          service:services (*)
        `);

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.fromDate) {
        query = query.gte('scheduled_at', filters.fromDate);
      }

      if (filters?.toDate) {
        query = query.lte('scheduled_at', filters.toDate);
      }

      if (filters?.technicianId) {
        query = query.eq('technician_id', filters.technicianId);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw new DatabaseOperationError(
          'fetch_bookings',
          { code: error.code }
        );
      }

      return bookings || [];
    }, { path: 'booking/list' });
  }

  async getBookingById(id: string): Promise<ServiceResponse<BookingWithService>> {
    return this.handleRequest(async () => {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          service:services (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new DatabaseOperationError(
          'fetch_booking',
          { code: error.code }
        );
      }

      if (!booking) {
        throw new NotFoundError('Booking');
      }

      return booking;
    }, { path: `booking/${id}` });
  }
}

// Create singleton instance
export const bookingService = new BookingService();
