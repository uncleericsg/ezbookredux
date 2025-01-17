// Re-export all shared types
export * from './booking';
export * from './user';
export * from './payment';
export * from './error';
export * from './service';
export * from './address';
export * from './profile';
export * from './notification';

// Type utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

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

// Common response types
export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'failed'; 