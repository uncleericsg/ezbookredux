import type { Database } from './database';

export interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;
  categoryId: string | null;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  metadata: ServiceMetadata | null;
}

export interface ServiceMetadata extends Record<string, unknown> {
  padding_before?: number;
  padding_after?: number;
}

export interface CreateServiceRequest {
  title: string;
  description?: string | null;
  price: number;
  duration: number;
  categoryId?: string | null;
  isActive?: boolean;
  padding_before?: number;
  padding_after?: number;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export function mapDatabaseService(dbService: Database['public']['Tables']['services']['Row']): Service {
  return {
    id: dbService.id,
    title: dbService.title,
    description: dbService.description,
    price: dbService.price,
    duration: dbService.duration,
    categoryId: dbService.categoryId,
    isActive: dbService.isActive,
    created_at: dbService.created_at,
    updated_at: dbService.updated_at,
    metadata: dbService.metadata as ServiceMetadata | null
  };
}

export function mapServiceToDatabase(service: CreateServiceRequest): Database['public']['Tables']['services']['Insert'] {
  const metadata: ServiceMetadata = {
    padding_before: service.padding_before ?? 0,
    padding_after: service.padding_after ?? 0
  };

  return {
    title: service.title,
    description: service.description ?? null,
    price: service.price,
    duration: service.duration,
    categoryId: service.categoryId ?? null,
    isActive: service.isActive ?? true,
    metadata
  };
}

export interface ServiceConfig {
  id: string;
  serviceId: string;
  enabled: boolean;
  apiKey: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export function mapServiceConfigToDatabase(config: ServiceConfig): Database['public']['Tables']['service_configs']['Insert'] {
  return {
    serviceId: config.serviceId,
    enabled: config.enabled,
    apiKey: config.apiKey,
    settings: config.settings,
    metadata: config.metadata
  };
}
