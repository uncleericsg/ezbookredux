import type { ServiceCategory, ServiceOption } from '../../types/service';

export interface ServiceState {
  services: ServiceCategory[];
  selectedService: ServiceOption | null;
  loading: boolean;
  error: string | null;
} 