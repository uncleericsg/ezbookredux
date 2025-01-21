import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type {
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  BookingStatus,
  BookingPaymentStatus,
  LocationInput
} from '@shared/types/booking';
import type { Service } from '@shared/types/entities';
import type { BaseEntity } from '@shared/types/repository';

interface BookingFilters {
  email?: string;
  customerId?: string;
  serviceId?: string;
  status?: BookingStatus;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface DatabaseBooking extends BaseEntity {
  customerId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  paymentId?: string;
  location: {
    address: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  rescheduling?: {
    fromDate: string;
    fromTime: string;
    reason: string;
  };
  technicianId?: string;
  completion?: {
    completedAt: string;
    duration: number;
    notes: string;
    rating?: number;
    review?: string;
    photos?: string[];
  };
  metadata?: Record<string, unknown>;
}

interface DatabaseBookingWithRelations extends DatabaseBooking {
  service: Service;
}

export class BookingService {
  async createBooking(data: CreateBookingInput): Promise<Booking> {
    try {
      logger.info('Creating new booking', { data });

      // Verify service exists
      const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', data.serviceId)
        .single();

      if (serviceError || !service) {
        logger.error('Service not found', { serviceId: data.serviceId });
        throw new ApiError('Service not found', 'NOT_FOUND');
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('bookings')
        .insert({
          customerId: data.customerId,
          serviceId: data.serviceId,
          date: data.date,
          time: data.time,
          duration: data.duration,
          price: service.price,
          status: 'pending' as BookingStatus,
          paymentStatus: 'pending' as BookingPaymentStatus,
          location: {
            address: data.location.address,
            postalCode: data.location.postalCode,
            coordinates: data.location.coordinates
          },
          notes: data.notes,
          technicianId: data.technicianId,
          metadata: data.metadata
        })
        .select(`
          *,
          service:services(*)
        `)
        .single();

      if (bookingError) {
        logger.error('Failed to create booking', { error: bookingError });
        throw new ApiError('Failed to create booking', 'DATABASE_ERROR');
      }

      return this.mapBooking(booking as DatabaseBookingWithRelations);
    } catch (error) {
      logger.error('Error in createBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create booking', 'INTERNAL_SERVER_ERROR');
    }
  }

  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    try {
      logger.info('Updating booking', { id, data });

      // Verify booking exists
      const { data: existingBooking, error: getError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (getError || !existingBooking) {
        logger.error('Booking not found', { id });
        throw new ApiError('Booking not found', 'NOT_FOUND');
      }

      const updateData: Partial<DatabaseBooking> = {
        serviceId: data.serviceId,
        date: data.date,
        time: data.time,
        duration: data.duration,
        location: data.location ? {
          address: data.location.address,
          postalCode: data.location.postalCode,
          coordinates: data.location.coordinates
        } : undefined,
        notes: data.notes,
        technicianId: data.technicianId,
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentId: data.paymentId,
        cancellationReason: data.cancellationReason,
        cancelledAt: data.cancellationReason ? new Date().toISOString() : undefined,
        rescheduling: data.rescheduling ? {
          fromDate: data.rescheduling.fromDate,
          fromTime: data.rescheduling.fromTime,
          reason: data.rescheduling.reason
        } : undefined,
        completion: data.completion ? {
          completedAt: data.completion.completedAt,
          duration: data.completion.duration,
          notes: data.completion.notes,
          rating: data.completion.rating,
          review: data.completion.review,
          photos: data.completion.photos
        } : undefined,
        metadata: data.metadata
      };

      // Update booking
      const { data: booking, error: updateError } = await supabaseAdmin
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          service:services(*)
        `)
        .single();

      if (updateError) {
        logger.error('Failed to update booking', { error: updateError });
        throw new ApiError('Failed to update booking', 'DATABASE_ERROR');
      }

      return this.mapBooking(booking as DatabaseBookingWithRelations);
    } catch (error) {
      logger.error('Error in updateBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update booking', 'INTERNAL_SERVER_ERROR');
    }
  }

  async getBooking(id: string): Promise<Booking> {
    try {
      const { data: booking, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          service:services(*)
        `)
        .eq('id', id)
        .single();

      if (error || !booking) {
        logger.error('Booking not found', { id });
        throw new ApiError('Booking not found', 'NOT_FOUND');
      }

      return this.mapBooking(booking as DatabaseBookingWithRelations);
    } catch (error) {
      logger.error('Error in getBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get booking', 'INTERNAL_SERVER_ERROR');
    }
  }

  async listBookings(filters: BookingFilters): Promise<Booking[]> {
    try {
      let query = supabaseAdmin
        .from('bookings')
        .select(`
          *,
          service:services(*)
        `);

      if (filters.email) {
        query = query.eq('customer.email', filters.email);
      }

      if (filters.customerId) {
        query = query.eq('customerId', filters.customerId);
      }

      if (filters.serviceId) {
        query = query.eq('serviceId', filters.serviceId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateRange) {
        query = query
          .gte('date', filters.dateRange.start)
          .lte('date', filters.dateRange.end);
      }

      const { data: bookings, error } = await query;

      if (error) {
        logger.error('Failed to list bookings', { error });
        throw new ApiError('Failed to list bookings', 'DATABASE_ERROR');
      }

      return (bookings || []).map(booking => 
        this.mapBooking(booking as DatabaseBookingWithRelations)
      );
    } catch (error) {
      logger.error('Error in listBookings', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to list bookings', 'INTERNAL_SERVER_ERROR');
    }
  }

  async cancelBooking(id: string, customerId: string): Promise<void> {
    try {
      // Verify booking exists and belongs to customer
      const { data: booking, error: getError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('customerId', customerId)
        .single();

      if (getError || !booking) {
        logger.error('Booking not found', { id, customerId });
        throw new ApiError('Booking not found', 'NOT_FOUND');
      }

      if (booking.status === 'cancelled') {
        logger.warn('Booking is already cancelled', { id });
        throw new ApiError('Booking is already cancelled', 'VALIDATION_ERROR');
      }

      // Update booking status
      const { error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        logger.error('Failed to cancel booking', { error: updateError });
        throw new ApiError('Failed to cancel booking', 'DATABASE_ERROR');
      }
    } catch (error) {
      logger.error('Error in cancelBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to cancel booking', 'INTERNAL_SERVER_ERROR');
    }
  }

  private mapBooking(booking: DatabaseBookingWithRelations): Booking {
    return {
      id: booking.id,
      customerId: booking.customerId,
      serviceId: booking.serviceId,
      date: new Date(booking.date),
      time: booking.time,
      duration: booking.duration,
      price: booking.price,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentId: booking.paymentId,
      location: {
        address: booking.location.address,
        postalCode: booking.location.postalCode,
        coordinates: booking.location.coordinates
      },
      notes: booking.notes,
      cancellationReason: booking.cancellationReason,
      cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : undefined,
      rescheduling: booking.rescheduling ? {
        fromDate: new Date(booking.rescheduling.fromDate),
        fromTime: booking.rescheduling.fromTime,
        reason: booking.rescheduling.reason
      } : undefined,
      technicianId: booking.technicianId,
      completion: booking.completion ? {
        completedAt: new Date(booking.completion.completedAt),
        duration: booking.completion.duration,
        notes: booking.completion.notes,
        rating: booking.completion.rating,
        review: booking.completion.review,
        photos: booking.completion.photos
      } : undefined,
      metadata: booking.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Export singleton instance
export const bookingService = new BookingService();
