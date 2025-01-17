declare module '@/utils/logger' {
  export const logger: {
    info: (message: string, metadata?: any) => void;
    warn: (message: string, metadata?: any) => void;
    error: (message: string, metadata?: any) => void;
    debug: (message: string, metadata?: any) => void;
  };
}

declare module '@/types/error' {
  export type ApiErrorCode = 
    | 'BAD_REQUEST' 
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_SERVER_ERROR'
    | 'SERVICE_UNAVAILABLE';

  export interface ErrorMetadata {
    name?: string;
    message?: string;
    stack?: string;
    code?: ApiErrorCode;
    details?: Record<string, any>;
  }

  export class ApiError extends Error {
    code: ApiErrorCode;
    details?: Record<string, any>;
    constructor(message: string, code: ApiErrorCode, details?: Record<string, any>);
  }

  export function createApiError(code: ApiErrorCode, message: string, details?: Record<string, any>): ApiError;
}

declare module '@/types/services' {
  export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    isAvailable: boolean;
    is_available?: boolean;
    isPeakHour?: boolean;
    is_peak_hour?: boolean;
    priceMultiplier?: number;
    price_multiplier?: number;
    metadata?: Record<string, any>;
  }

  export interface ServiceProvider {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    availability: TimeSlot[];
    location: ServiceLocation;
    isActive: boolean;
  }

  export interface ServiceVisit {
    id: string;
    userId: string;
    providerId: string;
    locationId: string;
    serviceType: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    startTime: string;
    endTime: string;
    notes?: string;
    metadata?: Record<string, any>;
  }
}

declare module '@/types/notifications' {
  export interface NotificationPreferences {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    telegram?: boolean;
    scheduleReminders?: boolean;
    serviceUpdates?: boolean;
    marketingMessages?: boolean;
  }

  export interface Notification {
    id: string;
    userId: string;
    type: string;
    message: string;
    metadata?: Record<string, any>;
  }
}

declare module '@/utils/validation' {
  export function validateBookingTime(time: string): boolean;
  export function isValidUUID(str: string): boolean;
}

declare module '@/config/env' {
  export const ENV: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    STRIPE_PUBLIC_KEY: string;
    GOOGLE_MAPS_API_KEY: string;
  };
} 