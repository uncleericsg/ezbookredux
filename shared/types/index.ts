/**
 * Shared type definitions
 * This file re-exports all shared types and provides common utility types
 */

// Re-export domain types from booking
export type * from './booking';

// Re-export from user, excluding AuthenticationError
export type {
  User,
  UserProfile,
  UserRole,
  UserStatus,
  AuthResponse,
  OTPVerificationPayload
} from './user';

// Re-export from payment
export type * from './payment';

// Re-export from error
export type {
  ErrorCode,
  DatabaseError,
  AppError,
  ValidationError,
  ErrorResponse
} from './error';

export {
  BaseError,
  ValidationFailedError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseOperationError,
  isDatabaseError,
  isValidationError,
  isAppError,
  AuthError
} from './error';

// Re-export from service
export type * from './service';

// Base entity types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface BaseEntityOptional {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

// Common utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type WithTimestamps = {
  created_at: string;
  updated_at: string;
};

export type WithOptionalTimestamps = {
  created_at?: string;
  updated_at?: string;
};

export type WithId = {
  id: string;
};

export type WithOptionalId = {
  id?: string;
};

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'failed';

// Utility type for requiring at least one property
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

// Utility type for making specific properties required
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Utility type for making specific properties optional
export type OptionalProperties<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    nextCursor?: string;
  };
}

// Common filter types
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface SortOrder {
  field: string;
  direction: 'asc' | 'desc';
}

// Type guard utilities
export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};