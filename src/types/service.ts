import type { BaseEntity } from './common';

export interface ServiceCategory extends BaseEntity {
  name: string;
  description?: string;
  parent_id?: string;
  order: number;
  is_active: boolean;
  image_url?: string;
}

export interface ServiceOption extends BaseEntity {
  name: string;
  description?: string;
  category_id: string;
  price: number;
  duration: number;
  is_active: boolean;
  peak_hour_multiplier?: number;
  features?: string[];
  image_url?: string;
}

export interface ServiceRequest {
  service_id: string;
  customer_id?: string;
  scheduled_date?: Date;
  status?: ServiceRequestStatus;
  payment_confirmed?: boolean;
  tip_amount?: number;
  total_amount?: number;
}

export type ServiceRequestStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceVisit extends BaseEntity {
  user_id: string;
  service_id: string;
  visit_date: Date;
  status: ServiceVisitStatus;
  technician_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export type ServiceVisitStatus = 
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number;
  usual_price: number | null;
  duration_minutes: number;
  padding_before_minutes: number;
  padding_after_minutes: number;
  is_active: boolean;
}

export interface CreateServiceRequest {
  title: string;
  description?: string;
  price: number;
  usual_price?: number;
  duration_minutes: number;
  padding_before_minutes?: number;
  padding_after_minutes?: number;
  is_active?: boolean;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string | null;
  price?: number;
  usual_price?: number | null;
  duration_minutes?: number;
  padding_before_minutes?: number;
  padding_after_minutes?: number;
  is_active?: boolean;
}

export interface ServiceResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  usual_price: number | null;
  duration_minutes: number;
  is_active: boolean;
}
