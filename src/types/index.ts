import type { LucideIcon } from 'lucide-react';

export interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
  duration?: number;
  weight?: number;
}

export interface FetchError extends Error {
  status?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  price: number | null;
  duration: number;
  type?: 'maintenance' | 'repair' | 'amc' | 'diagnostic';
  icon: LucideIcon;
  visible?: boolean;
  order?: number;
  parentId?: string;
  visibilityType?: 'all' | 'amc';
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
}

export interface Region {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  isAMC?: boolean;
}

export interface BookingDetails {
  datetime: string;
  categoryId: string;
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
}

export interface AMCPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  visits: number;
  appointmentTypeId?: string;
  isActive?: boolean;
}

export interface ServiceRatingProps {
  onSubmit: (rating: number, feedback?: string) => Promise<void>;
  onClose: () => void;
  serviceId: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
}

export interface HolidayGreeting {
  id: string;
  holiday: string;
  date: string;
  message: string;
  enabled: boolean;
  sendTime: string;
}

export interface CustomMessage {
  id: string;
  message: string;
  scheduledDateTime: string;
  recipients: string[];
  status: 'pending' | 'sent' | 'failed';
}

export interface MessageSchedule {
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  userType: 'all' | 'amc' | 'regular';
}

export interface MessageStats {
  total: number;
  sent: number;
  pending: number;
  failed: number;
}

export interface UseCustomMessagesResult {
  messages: CustomMessage[];
  loading: boolean;
  error: string | null;
  scheduleMessage: (schedule: MessageSchedule) => Promise<void>;
  generateMessage: () => Promise<string>;
  messageStats: MessageStats | undefined;
  hasStats: boolean;
}