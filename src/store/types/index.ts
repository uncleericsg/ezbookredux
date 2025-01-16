import type { AdminState } from './admin.types';
import type { AuthState } from './auth.types';
import type { BookingState } from './booking.types';
import type { ServiceState } from './service.types';
import type { UserState } from './user.types';

export interface RootState {
  admin: AdminState;
  auth: AuthState;
  booking: BookingState;
  service: ServiceState;
  user: UserState;
}

// Re-export individual state types
export type { AdminState } from './admin.types';
export type { AuthState } from './auth.types';
export type { BookingState } from './booking.types';
export type { ServiceState } from './service.types';
export type { UserState } from './user.types';
