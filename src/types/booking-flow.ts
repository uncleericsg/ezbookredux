import type { CustomerInfo } from './customer';
import type { TimeSlot } from './timeSlot';

/**
 * Booking step type
 */
export type BookingStep = 'service' | 'customer' | 'schedule' | 'booking' | 'payment' | 'confirmation';

/**
 * Booking status type
 */
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Booking data type
 */
export interface BookingData {
  id?: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  serviceDuration: number;
  customerInfo: CustomerInfo;
  date: string;
  time: string;
  timeSlot?: TimeSlot;
  status: BookingStatus;
  brands: string[];
  issues: string[];
  otherIssue?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  totalAmount?: number;
  tipAmount?: number;
  createdAt?: string;
  updatedAt?: string;
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
      region: 'central', // Default region
      floorUnit: '',
    }
  },
  date: '',
  time: '',
  status: 'pending',
  brands: [],
  issues: [],
  paymentStatus: 'pending',
  totalAmount: 0,
  tipAmount: 0
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
