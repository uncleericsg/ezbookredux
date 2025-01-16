import { createClient } from '@supabase/supabase-js';
import { Service, CreateServiceRequest, UpdateServiceRequest } from '../types/service';
import { createApiError } from '../utils/apiResponse';
import { Database } from '../types/supabase';

export class ServiceService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  async listServices(includeInactive = false): Promise<Service[]> {
    try {
      let query = this.supabase
        .from('services')
        .select('*')
        .order('title');

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('List services error:', error);
      throw createApiError('Failed to fetch services', 'SERVER_ERROR');
    }
  }

  async getService(id: string): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw createApiError('Service not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      console.error('Get service error:', error);
      throw createApiError('Failed to fetch service', 'SERVER_ERROR');
    }
  }

  async createService(data: CreateServiceRequest): Promise<Service> {
    try {
      const { data: service, error } = await this.supabase
        .from('services')
        .insert({
          ...data,
          padding_before_minutes: data.padding_before_minutes || 0,
          padding_after_minutes: data.padding_after_minutes || 0,
          is_active: data.is_active ?? true
        })
        .select()
        .single();

      if (error) throw error;
      if (!service) throw new Error('Failed to create service');

      return service;
    } catch (error) {
      console.error('Create service error:', error);
      throw createApiError('Failed to create service', 'SERVER_ERROR');
    }
  }

  async updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    try {
      const { data: service, error } = await this.supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!service) throw createApiError('Service not found', 'NOT_FOUND');

      return service;
    } catch (error) {
      console.error('Update service error:', error);
      throw createApiError('Failed to update service', 'SERVER_ERROR');
    }
  }
} 