import type { Database } from './database';

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  scheduledAt: string;
  status: BookingStatus;
  totalAmount: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  metadata?: BookingMetadata | null;
}

export interface CreateBookingRequest {
  userId: string;
  serviceId: string;
  scheduledAt: string;
  totalAmount: number;
  notes?: string | null;
  metadata?: BookingMetadata | null;
}

export interface UpdateBookingRequest {
  id: string;
  userId?: string;
  serviceId?: string;
  scheduledAt?: string;
  status?: BookingStatus;
  totalAmount?: number;
  notes?: string | null;
  metadata?: BookingMetadata | null;
}

export interface BookingMetadata extends Record<string, unknown> {
  padding_start?: number;
  padding_end?: number;
}

export function mapDatabaseBooking(dbBooking: any): Booking {
  return {
    id: dbBooking.id,
    userId: dbBooking.userId,
    serviceId: dbBooking.serviceId,
    scheduledAt: dbBooking.scheduledAt,
    status: dbBooking.status as BookingStatus,
    totalAmount: dbBooking.totalAmount,
    notes: dbBooking.notes,
    created_at: dbBooking.created_at,
    updated_at: dbBooking.updated_at,
    metadata: dbBooking.metadata as BookingMetadata | null
  };
}

export function mapBookingToDatabase(booking: CreateBookingRequest | UpdateBookingRequest): Record<string, unknown> {
  const dbBooking: Record<string, unknown> = {};

  if ('id' in booking) {
    dbBooking.id = booking.id;
  }
  if ('userId' in booking) {
    dbBooking.userId = booking.userId;
  }
  if ('serviceId' in booking) {
    dbBooking.serviceId = booking.serviceId;
  }
  if ('scheduledAt' in booking) {
    dbBooking.scheduledAt = booking.scheduledAt;
  }
  if ('status' in booking) {
    dbBooking.status = booking.status;
  }
  if ('totalAmount' in booking) {
    dbBooking.totalAmount = booking.totalAmount;
  }
  if ('notes' in booking) {
    dbBooking.notes = booking.notes;
  }
  if ('metadata' in booking) {
    dbBooking.metadata = booking.metadata;
  }

  return dbBooking;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface BookingListResponse extends Booking {
  service: {
    title: string;
    description?: string | null;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  } | null;
}
