import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServiceStatus,
  CreateServiceParams,
  UpdateServiceParams,
  ServiceManager as IServiceManager,
  DatabaseService,
  ServiceValidation
} from '@shared/types/service';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { validateServiceData } from '@server/utils/validation/serviceValidation';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class ServiceManager implements IServiceManager {
  async createService(params: CreateServiceParams): Promise<Service> {
    try {
      logger.info('Creating service', { params });

      const validationResult = validateServiceData(params);
      if (!validationResult.isValid) {
        logger.warn('Invalid service data', { 
          errors: validationResult.errors,
          params 
        });
        throw ApiError.validation('Invalid service data', validationResult.errors);
      }

      const { data: service, error } = await supabase
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
        logger.error('Database error creating service', { error, params });
        throw ApiError.database('Failed to create service', error);
      }

      if (!service) {
        logger.error('Failed to create service - no service returned', { params });
        throw ApiError.database('Failed to create service');
      }

      logger.info('Service created successfully', { serviceId: service.id });
      return this.mapService(service as DatabaseService);
    } catch (error) {
      logger.error('Create service error', { error: String(error), params });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to create service');
    }
  }

  async updateService(serviceId: string, params: UpdateServiceParams): Promise<Service> {
    try {
      logger.info('Updating service', { serviceId, params });

      const validationResult = validateServiceData(params, true);
      if (!validationResult.isValid) {
        logger.warn('Invalid service data', { 
          errors: validationResult.errors,
          serviceId,
          params 
        });
        throw ApiError.validation('Invalid service data', validationResult.errors);
      }

      const { data: existingService } = await supabase
        .from('services')
        .select()
        .eq('id', serviceId)
        .single();

      if (!existingService) {
        logger.warn('Service not found', { serviceId });
        throw ApiError.notFound('Service', serviceId);
      }

      const { data: service, error } = await supabase
        .from('services')
        .update({
          ...params,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) {
        logger.error('Database error updating service', { error, serviceId, params });
        throw ApiError.database('Failed to update service', error);
      }

      if (!service) {
        logger.error('Failed to update service - no service returned', { serviceId });
        throw ApiError.database('Failed to update service');
      }

      logger.info('Service updated successfully', { serviceId });
      return this.mapService(service as DatabaseService);
    } catch (error) {
      logger.error('Update service error', { error: String(error), serviceId, params });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to update service');
    }
  }

  async getServiceById(serviceId: string): Promise<Service> {
    try {
      logger.info('Fetching service', { serviceId });

      const { data: service, error } = await supabase
        .from('services')
        .select()
        .eq('id', serviceId)
        .single();

      if (error) {
        logger.error('Database error fetching service', { error, serviceId });
        throw ApiError.database('Failed to fetch service', error);
      }

      if (!service) {
        logger.warn('Service not found', { serviceId });
        throw ApiError.notFound('Service', serviceId);
      }

      logger.info('Service fetched successfully', { serviceId });
      return this.mapService(service as DatabaseService);
    } catch (error) {
      logger.error('Get service error', { error: String(error), serviceId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch service');
    }
  }

  async getServices(filters?: ServiceFilters): Promise<Service[]> {
    try {
      logger.info('Fetching services', { filters });

      let query = supabase.from('services').select();

      if (filters) {
        query = this.applyFilters(query, filters);
      }

      const { data: services, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Database error fetching services', { error, filters });
        throw ApiError.database('Failed to fetch services', error);
      }

      logger.info('Services fetched successfully', { count: services?.length || 0 });
      return (services || []).map(service => this.mapService(service as DatabaseService));
    } catch (error) {
      logger.error('Get services error', { error: String(error), filters });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch services');
    }
  }

  async getServicesByCategory(category: ServiceCategory, filters?: ServiceFilters): Promise<Service[]> {
    try {
      logger.info('Fetching services by category', { category, filters });

      let query = supabase
        .from('services')
        .select()
        .eq('category', category);

      if (filters) {
        query = this.applyFilters(query, filters);
      }

      const { data: services, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Database error fetching services by category', { 
          error,
          category,
          filters 
        });
        throw ApiError.database('Failed to fetch services', error);
      }

      logger.info('Services fetched successfully', { 
        category,
        count: services?.length || 0 
      });
      return (services || []).map(service => this.mapService(service as DatabaseService));
    } catch (error) {
      logger.error('Get services by category error', { 
        error: String(error),
        category,
        filters 
      });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch services');
    }
  }

  private applyFilters(query: any, filters: ServiceFilters): any {
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

  private mapService(service: DatabaseService): Service {
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      status: service.status,
      image_url: service.image_url,
      technician_requirements: service.technician_requirements,
      created_at: service.created_at,
      updated_at: service.updated_at
    };
  }
}

export const serviceManager = new ServiceManager();
