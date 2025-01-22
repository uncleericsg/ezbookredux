import type { Database } from './database';
import type { LucideIcon } from 'lucide-react';

/**
 * Service from database
 */
export type Service = Database['public']['Tables']['services']['Row'];

/**
 * Service category with icon
 */
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  services: Service[];
}

/**
 * Service provider (technician)
 */
export interface ServiceProvider {
  id: string;
  userId: string;
  specialties: string[];
  availability: {
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    hours: {
      start: string;
      end: string;
    };
  };
  rating: number;
  totalBookings: number;
  status: 'available' | 'busy' | 'offline';
}

/**
 * Service visit details
 */
export interface ServiceVisit {
  id: string;
  bookingId: string;
  technicianId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string | null;
  notes: string | null;
  photos: string[];
  signature: string | null;
}

/**
 * Service creation request
 */
export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

/**
 * Service update request
 */
export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  status?: 'active' | 'inactive';
}

/**
 * Service with related data
 */
export interface ServiceWithDetails extends Omit<Service, 'category'> {
  category: ServiceCategory;
  providers: ServiceProvider[];
}

/**
 * Service search filters
 */
export interface ServiceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  status?: 'active' | 'inactive';
}
