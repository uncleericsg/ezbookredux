/**
 * Core type definitions for the application
 */

/**
 * Type of error that can occur in the application
 */
export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'BUSINESS_ERROR'
  | 'SYSTEM_ERROR';

/**
 * Base error interface
 */
export interface BaseError {
  type: ErrorType;
  code: string;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Type of API response
 */
export interface ApiResponse<T> {
  data: T;
  error: BaseError | null;
  metadata?: ResponseMetadata;
}

/**
 * Metadata included in API responses
 */
export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  version: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMetadata;
}

export * from './models';
export * from './error';