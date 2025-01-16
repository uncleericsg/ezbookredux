import { Booking as PrismaBooking, Service, Payment } from '@prisma/client';

export type Booking = PrismaBooking & {
  customer_info: Record<string, any>;
  service: Service;
  payment: Payment[];
};

export interface CreateBookingInput {
  customerInfo: Record<string, any>;
  serviceIds: string[];
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface UpdateBookingInput {
  customerInfo?: Record<string, any>;
  serviceIds?: string[];
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}