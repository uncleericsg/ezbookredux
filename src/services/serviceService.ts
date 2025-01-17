import { supabaseClient } from '@/config/supabase/client';
import { handleDatabaseError } from '@/utils/apiErrors';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types/service';
import { mapServiceToDatabase } from '@/types/service';

export const serviceService = {
  async createService(data: CreateServiceRequest): Promise<Service> {
    try {
      const { data: service, error } = await supabaseClient
        .from('services')
        .insert(mapServiceToDatabase(data))
        .select()
        .single();

      if (error) {
        throw error;
      }

      return service;
    } catch (error) {
      throw handleDatabaseError('Failed to create service');
    }
  },

  async updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    try {
      const { data: service, error } = await supabaseClient
        .from('services')
        .update({
          ...mapServiceToDatabase(data),
          id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return service;
    } catch (error) {
      throw handleDatabaseError('Failed to update service');
    }
  }
}; 