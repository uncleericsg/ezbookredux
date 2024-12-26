import { supabase } from '@lib/supabase';
import { isValidUUID } from '@utils/validation';

export interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  appointment_type_id: string;
  usual_price?: number;
  is_premium?: boolean;
}

/**
 * Get service details from Supabase by appointment type ID
 * @param appointmentTypeId The frontend service id that maps to appointment_type_id
 */
export const getServiceByAppointmentType = async (appointmentTypeId: string): Promise<ServiceDetails | null> => {
  try {
    console.log('Looking up service with appointmentTypeId:', appointmentTypeId);
    
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('appointment_type_id', appointmentTypeId)
      .single();

    if (error) {
      console.error('Error finding service:', error);
      console.log('Query details:', {
        table: 'services',
        field: 'appointment_type_id',
        value: appointmentTypeId,
        error: error.message
      });
      return null;
    }

    if (!service) {
      console.log('No service found with appointment_type_id:', appointmentTypeId);
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error in getServiceByAppointmentType:', error);
    return null;
  }
};

/**
 * Get service details from Supabase by ID
 * @param id The service UUID
 */
export const getServiceById = async (id: string): Promise<ServiceDetails | null> => {
  try {
    // Validate UUID format first
    if (!isValidUUID(id)) {
      console.error('Invalid UUID format:', id);
      return null;
    }

    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding service:', error);
      console.log('Query details:', {
        table: 'services',
        field: 'id',
        value: id
      });
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error in getServiceById:', error);
    return null;
  }
};
