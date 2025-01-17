import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError, handleConfigurationError } from '@/utils/apiErrors';
import type { ServiceVisit } from '@/types/service';

export async function createServiceVisit(visit: Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceVisit> {
  logger.info('Creating service visit', { bookingId: visit.bookingId });

  const { data, error } = await supabaseClient
    .from('service_visits')
    .insert({
      booking_id: visit.bookingId,
      technician_id: visit.technicianId,
      start_time: visit.startTime,
      end_time: visit.endTime,
      status: visit.status,
      notes: visit.notes
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create service visit', {
      message: error.message,
      details: { bookingId: visit.bookingId }
    });
    throw error;
  }

  return {
    id: data.id,
    bookingId: data.booking_id,
    technicianId: data.technician_id,
    startTime: data.start_time,
    endTime: data.end_time,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
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
    throw error;
  }

  if (!data) {
    throw handleNotFoundError(`Service visit with id ${id} not found`);
  }

  return {
    id: data.id,
    bookingId: data.booking_id,
    technicianId: data.technician_id,
    startTime: data.start_time,
    endTime: data.end_time,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateServiceVisit(id: string, visit: Partial<Omit<ServiceVisit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceVisit> {
  logger.info('Updating service visit', { id });

  const { data, error } = await supabaseClient
    .from('service_visits')
    .update({
      technician_id: visit.technicianId,
      start_time: visit.startTime,
      end_time: visit.endTime,
      status: visit.status,
      notes: visit.notes
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update service visit', {
      message: error.message,
      details: { id }
    });
    throw error;
  }

  if (!data) {
    throw handleNotFoundError(`Service visit with id ${id} not found`);
  }

  return {
    id: data.id,
    bookingId: data.booking_id,
    technicianId: data.technician_id,
    startTime: data.start_time,
    endTime: data.end_time,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
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
    throw error;
  }

  return data?.map(visit => ({
    id: visit.id,
    bookingId: visit.booking_id,
    technicianId: visit.technician_id,
    startTime: visit.start_time,
    endTime: visit.end_time,
    status: visit.status,
    notes: visit.notes,
    createdAt: visit.created_at,
    updatedAt: visit.updated_at
  })) || [];
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
    throw error;
  }

  return data?.map(visit => ({
    id: visit.id,
    bookingId: visit.booking_id,
    technicianId: visit.technician_id,
    startTime: visit.start_time,
    endTime: visit.end_time,
    status: visit.status,
    notes: visit.notes,
    createdAt: visit.created_at,
    updatedAt: visit.updated_at
  })) || [];
}