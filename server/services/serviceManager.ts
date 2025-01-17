import { createClient } from '@supabase/supabase-js';
import type { Database } from '@server/types/database';
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServiceStatus,
  CreateServiceParams,
  UpdateServiceParams
} from '@shared/types/service';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { validateServiceData } from '@server/utils/validation';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class ServiceManager {
  async createService(params: CreateServiceParams): Promise<Service> {
    try {
      const validationError = validateServiceData(params);
      if (validationError) {
        throw new ApiError(validationError.message, 'INVALID_SERVICE_DATA');
      }

      const { data, error } = await supabase
        .from('services')
        .insert({
          ...params,
          status: 'active' as ServiceStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create service', { error, params });
        throw new ApiError('Failed to create service', 'SERVICE_CREATE_ERROR');
      }

      if (!data) {
        throw new ApiError('No service data returned', 'SERVICE_CREATE_ERROR');
      }

      logger.info('Created service', { serviceId: data.id, params });
      return data;
    } catch (error) {
      logger.error('Error in createService', { error, params });
      throw this.handleError(error);
    }
  }

  async updateService(serviceId: string, params: UpdateServiceParams): Promise<Service> {
    try {
      const validationError = validateServiceData(params);
      if (validationError) {
        throw new ApiError(validationError.message, 'INVALID_SERVICE_DATA');
      }

      const { data: existingService } = await supabase
        .from('services')
        .select()
        .eq('id', serviceId)
        .single();

      if (!existingService) {
        throw new ApiError('Service not found', 'SERVICE_NOT_FOUND');
      }

      const { data, error } = await supabase
        .from('services')
        .update({
          ...params,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update service', { error, serviceId, params });
        throw new ApiError('Failed to update service', 'SERVICE_UPDATE_ERROR');
      }

      if (!data) {
        throw new ApiError('No service data returned', 'SERVICE_UPDATE_ERROR');
      }

      logger.info('Updated service', { serviceId, params });
      return data;
    } catch (error) {
      logger.error('Error in updateService', { error, serviceId, params });
      throw this.handleError(error);
    }
  }

  async getServiceById(serviceId: string): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select()
        .eq('id', serviceId)
        .single();

      if (error) {
        logger.error('Failed to get service', { error, serviceId });
        throw new ApiError('Failed to get service', 'SERVICE_FETCH_ERROR');
      }

      if (!data) {
        throw new ApiError('Service not found', 'SERVICE_NOT_FOUND');
      }

      return data;
    } catch (error) {
      logger.error('Error in getServiceById', { error, serviceId });
      throw this.handleError(error);
    }
  }

  async getServices(filters?: ServiceFilters): Promise<Service[]> {
    try {
      let query = supabase.from('services').select();

      query = this.applyFilters(query, filters);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to get services', { error, filters });
        throw new ApiError('Failed to get services', 'SERVICES_FETCH_ERROR');
      }

      return data || [];
    } catch (error) {
      logger.error('Error in getServices', { error, filters });
      throw this.handleError(error);
    }
  }

  async getServicesByCategory(category: ServiceCategory, filters?: ServiceFilters): Promise<Service[]> {
    try {
      let query = supabase
        .from('services')
        .select()
        .eq('category', category);

      query = this.applyFilters(query, filters);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to get services by category', { error, category, filters });
        throw new ApiError('Failed to get services', 'SERVICES_FETCH_ERROR');
      }

      return data || [];
    } catch (error) {
      logger.error('Error in getServicesByCategory', { error, category, filters });
      throw this.handleError(error);
    }
  }

  private applyFilters(query: any, filters?: ServiceFilters): any {
    if (!filters) return query;

    const { status, minPrice, maxPrice, search } = filters;

    if (status) {
      query = query.eq('status', status);
    }

    if (typeof minPrice === 'number') {
      query = query.gte('price', minPrice);
    }

    if (typeof maxPrice === 'number') {
      query = query.lte('price', maxPrice);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    return query;
  }

  private handleError(error: unknown): never {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'SERVICE_MANAGER_ERROR'
    );
  }
}

export const serviceManager = new ServiceManager(); 