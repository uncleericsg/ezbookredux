import type { Database } from './database';

export interface TimeSlot {
  id: string;
  serviceId: string | null;
  technicianId: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isPeakHour: boolean;
  priceMultiplier: number;
  status: TimeSlotStatus;
  blockReason: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
  metadata: TimeSlotMetadata | null;
}

export type TimeSlotStatus = 'available' | 'booked' | 'blocked';

export interface TimeSlotMetadata extends Record<string, unknown> {
  location?: {
    lat: number;
    lng: number;
  };
}

export interface CreateTimeSlotRequest {
  serviceId?: string | null;
  technicianId?: string | null;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  isPeakHour?: boolean;
  priceMultiplier?: number;
  status?: TimeSlotStatus;
  blockReason?: string | null;
  duration?: number | null;
  metadata?: TimeSlotMetadata | null;
}

export interface UpdateTimeSlotRequest extends Partial<CreateTimeSlotRequest> {
  id: string;
}

export function mapDatabaseTimeSlot(dbTimeSlot: Database['public']['Tables']['time_slots']['Row']): TimeSlot {
  return {
    id: dbTimeSlot.id,
    serviceId: dbTimeSlot.serviceId,
    technicianId: dbTimeSlot.technicianId,
    startTime: dbTimeSlot.startTime,
    endTime: dbTimeSlot.endTime,
    isAvailable: dbTimeSlot.isAvailable,
    isPeakHour: dbTimeSlot.isPeakHour,
    priceMultiplier: dbTimeSlot.priceMultiplier,
    status: dbTimeSlot.status as TimeSlotStatus,
    blockReason: dbTimeSlot.blockReason,
    duration: dbTimeSlot.duration,
    created_at: dbTimeSlot.created_at,
    updated_at: dbTimeSlot.updated_at,
    metadata: dbTimeSlot.metadata as TimeSlotMetadata | null
  };
}

export function mapTimeSlotToDatabase(timeSlot: CreateTimeSlotRequest): Database['public']['Tables']['time_slots']['Insert'] {
  return {
    serviceId: timeSlot.serviceId ?? null,
    technicianId: timeSlot.technicianId ?? null,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    isAvailable: timeSlot.isAvailable ?? true,
    isPeakHour: timeSlot.isPeakHour ?? false,
    priceMultiplier: timeSlot.priceMultiplier ?? 1,
    status: timeSlot.status ?? 'available',
    blockReason: timeSlot.blockReason ?? null,
    duration: timeSlot.duration ?? null,
    metadata: timeSlot.metadata ?? null
  };
} 