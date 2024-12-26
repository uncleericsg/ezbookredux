import { supabase } from '@lib/supabase';

/**
 * Get service details from Supabase by appointment type ID
 * @param appointmentTypeId The appointment type ID (e.g., 'premium-6units')
 */
export const getServiceByAppointmentType = async (appointmentTypeId: string): Promise<ServiceDetails | null> => {
  try {
    // First check if the service exists
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('appointment_type_id', appointmentTypeId)
      .single();

    if (error) {
      console.error('Error finding service:', error);
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error in getServiceByAppointmentType:', error);
    return null;
  }
};

/**
 * Get service details from Supabase by UUID
 * @param id The service UUID
 */
export const getServiceById = async (id: string): Promise<ServiceDetails | null> => {
  try {
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding service:', error);
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error in getServiceById:', error);
    return null;
  }
};

export interface ServiceDetails {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  usual_price?: number;
  is_premium: boolean;
}
