/**
 * Database schema types
 */
export interface DBServiceVisit {
  id: string;
  booking_id: string;
  technician_id?: string;
  package_id: string;
  start_time?: string;
  end_time?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  label?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Type mapping functions
 */
import type { ServiceVisit } from './amc';

export function mapDBServiceVisitToServiceVisit(dbVisit: DBServiceVisit): ServiceVisit {
  return {
    id: dbVisit.id,
    packageId: dbVisit.package_id,
    date: dbVisit.start_time || '',
    label: dbVisit.label || '',
    status: dbVisit.status,
    notes: dbVisit.notes,
    technicianId: dbVisit.technician_id,
    createdAt: dbVisit.created_at,
    updatedAt: dbVisit.updated_at
  };
}

export function mapServiceVisitToDB(
  visit: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>,
  bookingId: string
): Omit<DBServiceVisit, 'id' | 'created_at' | 'updated_at'> {
  return {
    booking_id: bookingId,
    package_id: visit.packageId,
    start_time: visit.date,
    status: visit.status,
    label: visit.label,
    notes: visit.notes,
    technician_id: visit.technicianId,
    end_time: visit.date // Using same date for end_time as a default
  };
}