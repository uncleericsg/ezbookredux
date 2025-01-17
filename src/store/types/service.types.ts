import type { ServiceCategory } from '../../types/serviceCategory';

export interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  categoryId: string;
  isAvailable: boolean;
}

export interface ServiceState {
  services: ServiceCategory[];
  selectedService: ServiceOption | null;
  loading: boolean;
  error: string | null;
} 