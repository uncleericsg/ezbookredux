import type { Booking, BookingStatus } from '@/types/booking';

export function createMockBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    serviceType: 'repair',
    status: 'pending',
    scheduledDate: new Date().toISOString(),
    address: '123 Test St',
    ...overrides
  };
}

export function validateBookingStatus(status: string): status is BookingStatus {
  return ['pending', 'confirmed', 'completed', 'cancelled'].includes(status);
}

export function validateBookingData(booking: Partial<Booking>): boolean {
  if (!booking.userId || !booking.serviceType || !booking.scheduledDate || !booking.address) {
    return false;
  }

  if (booking.status && !validateBookingStatus(booking.status)) {
    return false;
  }

  return true;
} 