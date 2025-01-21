export interface BookingResult {
  data?: Booking[];
  error?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  date: string;
  status: BookingStatus;
}

export type BookingStatus = 'pending' | 'completed' | 'cancelled' | 'confirmed' | 'rescheduled';

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  serviceId?: string;
}
