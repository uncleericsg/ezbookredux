// Core type exports
export type {
  ErrorCode,
  BaseError,
  ValidationError,
  DatabaseError,
  AuthError,
  AppError
} from './error';

export type {
  Database,
  Tables,
  Views,
  Functions,
  Enums
} from './database';

export type {
  ValidationRule,
  ValidationResult,
  ValidationContext,
  ValidationSchema
} from './validation';

export type {
  Booking,
  BookingStatus,
  BookingState,
  TimeSlot,
  BookingValidation,
  BookingFilters,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingWithDetails
} from './booking';

export type {
  Service,
  ServiceCategory,
  ServiceProvider,
  ServiceVisit,
  ServiceFilters,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceWithDetails
} from './service';

export type {
  User,
  UserRole,
  UserProfile
} from './user';

export type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
  Payment,
  PaymentSession,
  CreatePaymentRequest,
  PaymentWithDetails
} from './payment';

export type {
  Route,
  RouteConfig,
  RouteParams,
  RouteGuard
} from './route';

export type {
  Middleware,
  MiddlewareConfig,
  MiddlewareFunction,
  RequestHandler
} from './middleware';

export type {
  LogLevel,
  LogEntry,
  Logger,
  LoggerConfig
} from './logger';

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
export type ErrorResult = {
  error: BaseError;
  details?: Record<string, unknown>;
};

// Type guards
export const isErrorResult = (result: unknown): result is ErrorResult => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'error' in result &&
    result.error instanceof BaseError
  );
};