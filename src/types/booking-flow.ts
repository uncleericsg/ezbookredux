import type { CustomerInfo } from './customer';

/**
 * Time slot type
 */
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
}

/**
 * Booking step type
 */
export type BookingStep = 'service' | 'customer' | 'schedule' | 'booking' | 'payment' | 'confirmation';

/**
 * Booking data type
 */
export interface BookingData {
  id?: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  serviceDuration: number;
  duration?: number; // For backward compatibility
  customerInfo: CustomerInfo;
  date: string;
  time: string;
  status?: string;
  brands: string[];
  issues: string[];
}

/**
 * Initial booking data
 */
export const INITIAL_BOOKING_DATA: BookingData = {
  serviceId: '',
  serviceTitle: '',
  servicePrice: 0,
  serviceDuration: 60,
  customerInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      blockStreet: '',
      postalCode: '',
      region: 'central' // Default region
    }
  },
  date: '',
  time: '',
  brands: [],
  issues: []
};

/**
 * Base step props
 */
export interface BaseStepProps {
  onNext: () => void;
  onBack: () => void;
  bookingData: BookingData;
  onUpdateBookingData: (data: BookingData) => void;
  className?: string;
}

/**
 * Payment step props
 */
export interface PaymentStepProps extends BaseStepProps {
  onComplete: (paymentId: string) => void;
}

/**
 * Booking confirmation props
 */
export interface BookingConfirmationProps {
  booking: BookingData;
  onViewBookings: () => void;
  className?: string;
}
