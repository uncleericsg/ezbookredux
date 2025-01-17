/**
 * Shared service-related type definitions
 */

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ServiceConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export type ServiceMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ServiceRequest {
  method: ServiceMethod;
  path: string;
  body?: any;
  headers?: Record<string, string>;
}