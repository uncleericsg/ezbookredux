import { ReactNode } from 'react';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ServiceType = 'repair' | 'maintenance' | 'installation';

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  specialInstructions?: string;
  [key: string]: string | undefined; // Index signature for dynamic field access
}

export interface ServiceOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  usualPrice?: number;
  appointmentTypeId: string;
  isPremium?: boolean;
}

export interface BookingDetails {
  brands: string[];
  issues: string[];
  customerInfo: CustomerFormData;
  scheduledDateTime: Date;
  scheduledTimeSlot: string;
  selectedService: ServiceOption;
  otherIssue?: string;
  isAMC?: boolean;
  paymentCompleted?: boolean;
  paymentDate?: string;
  paymentIntentId?: string;
  status?: BookingStatus;
  serviceType?: ServiceType;
}

export interface BookingData {
  brands: string[];
  issues: string[];
  customerInfo: CustomerFormData | null;
  scheduledDateTime?: Date;
  scheduledTimeSlot?: string;
  selectedService: ServiceOption | null;
  bookingId?: string;
  otherIssue?: string;
  isAMC?: boolean;
  isFirstTimeFlow?: boolean;
}