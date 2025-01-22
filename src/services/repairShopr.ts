import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError, handleConfigurationError } from '@/utils/apiErrors';
import type { ServiceVisit } from '@/types/amc';
import type { DBServiceVisit } from '@/types/database';
import { mapDBServiceVisitToServiceVisit, mapServiceVisitToDB } from '@/types/database';

export async function createServiceVisit(
  visit: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>,
  bookingId: string
): Promise<ServiceVisit> {
  logger.info('Creating service visit', { bookingId });

  const dbVisit = mapServiceVisitToDB(visit, bookingId);
  
  const { data, error } = await supabaseClient
    .from('service_visits')
    .insert(dbVisit)
    .select()
    .single();

  if (error) {
    logger.error('Failed to create service visit', {
      message: error.message,
      details: { bookingId }
    });
    throw handleConfigurationError({
      code: 'SERVICE_VISIT_CREATE_FAILED',
      message: 'Failed to create service visit',
      originalError: error
    });
  }

  return mapDBServiceVisitToServiceVisit(data as DBServiceVisit);
}

export async function getServiceVisit(id: string): Promise<ServiceVisit> {
  logger.info('Fetching service visit', { id });

  const { data, error } = await supabaseClient
    .from('service_visits')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Failed to fetch service visit', {
      message: error.message,
      details: { id }
    });
    throw handleConfigurationError({
      code: 'SERVICE_VISIT_FETCH_FAILED',
      message: 'Failed to fetch service visit',
      originalError: error
    });
  }

  if (!data) {
    throw handleNotFoundError(`Service visit with id ${id} not found`);
  }

  return mapDBServiceVisitToServiceVisit(data as DBServiceVisit);
}

export async function updateServiceVisit(
  id: string,
  visit: Partial<Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>>,
  bookingId: string
): Promise<ServiceVisit> {
  logger.info('Updating service visit', { id });

  const dbVisit = mapServiceVisitToDB({ ...visit, packageId: '', date: '', label: '', status: 'scheduled' }, bookingId);
  
  const { data, error } = await supabaseClient
    .from('service_visits')
    .update(dbVisit)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update service visit', {
      message: error.message,
      details: { id }
    });
    throw handleConfigurationError({
      code: 'SERVICE_VISIT_UPDATE_FAILED',
      message: 'Failed to update service visit',
      originalError: error
    });
  }

  if (!data) {
    throw handleNotFoundError(`Service visit with id ${id} not found`);
  }

  return mapDBServiceVisitToServiceVisit(data as DBServiceVisit);
}

export async function deleteServiceVisit(id: string): Promise<void> {
  logger.info('Deleting service visit', { id });

  const { error } = await supabaseClient
    .from('service_visits')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete service visit', {
      message: error.message,
      details: { id }
    });
    throw error;
  }
}

export async function getServiceVisitsByBooking(bookingId: string): Promise<ServiceVisit[]> {
  logger.info('Fetching service visits by booking', { bookingId });

  const { data, error } = await supabaseClient
    .from('service_visits')
    .select()
    .eq('booking_id', bookingId);

  if (error) {
    logger.error('Failed to fetch service visits by booking', {
      message: error.message,
      details: { bookingId }
    });
    throw handleConfigurationError({
      code: 'SERVICE_VISIT_FETCH_FAILED',
      message: 'Failed to fetch service visits by booking',
      originalError: error
    });
  }

  return data?.map(visit => mapDBServiceVisitToServiceVisit(visit as DBServiceVisit)) || [];
}

export async function resetVisitLabels(packageId: string): Promise<void> {
  logger.info('Resetting visit labels', { packageId });

  const { error } = await supabaseClient
    .from('service_visits')
    .update({ label: null })
    .eq('package_id', packageId);

  if (error) {
    logger.error('Failed to reset visit labels', {
      message: error.message,
      details: { packageId }
    });
    throw handleConfigurationError({
      code: 'RESET_LABELS_FAILED',
      message: 'Failed to reset visit labels',
      originalError: error
    });
  }
}

export async function getServiceVisitsByTechnician(technicianId: string): Promise<ServiceVisit[]> {
  logger.info('Fetching service visits by technician', { technicianId });

  const { data, error } = await supabaseClient
    .from('service_visits')
    .select()
    .eq('technician_id', technicianId);

  if (error) {
    logger.error('Failed to fetch service visits by technician', {
      message: error.message,
      details: { technicianId }
    });
    throw handleConfigurationError({
      code: 'SERVICE_VISIT_FETCH_FAILED',
      message: 'Failed to fetch service visits by technician',
      originalError: error
    });
  }

  return data?.map(visit => mapDBServiceVisitToServiceVisit(visit as DBServiceVisit)) || [];
}