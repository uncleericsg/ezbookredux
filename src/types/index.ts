// API Types
export * from './api';
export * from './webhook';
export * from './payment';
export * from './service';
export * from './user';
export * from './booking';
export * from './auth';

// Common Types
export type Nullable<T> = T | null;

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Error Types
export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'PAYMENT_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'PRICING_ERROR'
  | 'SERVICE_INIT_ERROR'
  | 'FIREBASE_AUTH_ERROR'
  | 'FIREBASE_DB_ERROR'
  | 'STRIPE_ERROR'
  | 'MAPS_ERROR'
  | 'BOOKING_IN_PROGRESS'
  | 'MAX_RETRIES';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action';

// Service Types
export interface ServiceVisit extends BaseEntity {
  user_id: string;
  service_id: string;
  visit_date: string;
  status: string;
  notes?: string;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'technician';
  status: 'active' | 'inactive';
  phone?: string;
}

// Holiday Types
export interface Holiday {
  date: string;
  name: string;
  type: 'public' | 'school' | 'bank';
  isWorkingDay: boolean;
}