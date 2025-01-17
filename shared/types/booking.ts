import type { Address } from './address';

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  floor_unit: string;
  block_street: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingDetails {
  id: string;
  customerId: string;
  serviceId: string;
  date: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingResponse = BookingDetails;

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  service?: string;
}

export interface CreateBookingParams extends Omit<BookingDetails, 'id' | 'createdAt' | 'updatedAt'> {
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface UpdateBookingParams extends Partial<Omit<BookingDetails, 'id' | 'createdAt' | 'updatedAt'>> {
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface BookingsListResponse {
  bookings: BookingResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BookingError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
} 