import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError, handleValidationError } from '@/utils/apiErrors';
import type { Service } from '@/types/service';

export interface ServiceDetails extends Omit<Service, 'metadata'> {
  // All fields are already in the Service interface
}

export function mapDatabaseService(dbService: Service): ServiceDetails {
  return {
    id: dbService.id,
    title: dbService.title,
    description: dbService.description,
    price: dbService.price,
    duration: dbService.duration,
    categoryId: dbService.categoryId,
    isActive: dbService.isActive,
    created_at: dbService.created_at,
    updated_at: dbService.updated_at
  };
}

export async function getServiceById(id: string): Promise<ServiceDetails | null> {
  if (!isValidUUID(id)) {
    logger.warn('Invalid UUID format', { id });
    return null;
  }

  const { data: service, error } = await supabaseClient
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleNotFoundError('Service not found');
  }

  return service ? mapDatabaseService(service) : null;
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function validateServiceId(serviceId: string): Promise<boolean> {
  if (!isValidUUID(serviceId)) {
    handleValidationError('Invalid service ID format');
  }

  const { data: service, error } = await supabaseClient
    .from('services')
    .select('id')
    .eq('id', serviceId)
    .single();

  if (error || !service) {
    handleNotFoundError('Service not found');
  }

  return true;
}

export async function validateTechnicianId(technicianId: string): Promise<boolean> {
  if (!isValidUUID(technicianId)) {
    handleValidationError('Invalid technician ID format');
  }

  const { data: technician, error } = await supabaseClient
    .from('technicians')
    .select('id')
    .eq('id', technicianId)
    .single();

  if (error || !technician) {
    handleNotFoundError('Technician not found');
  }

  return true;
}

export async function validateBookingId(bookingId: string): Promise<boolean> {
  if (!isValidUUID(bookingId)) {
    handleValidationError('Invalid booking ID format');
  }

  const { data: booking, error } = await supabaseClient
    .from('bookings')
    .select('id')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    handleNotFoundError('Booking not found');
  }

  return true;
}
