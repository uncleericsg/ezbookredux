// Type utilities for handling exact optional properties
type ExactOptionalPropertyTypes<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] | undefined : T[K];
};

// Re-export common types with exact optional properties
import type { ServiceCategory as BaseServiceCategory } from './homepage';
import type { CardSettings as BaseCardSettings } from './homepage';
import type { NotificationTemplateProps as BaseNotificationTemplateProps } from './notification';
import type { BookingState as BaseBookingState } from '../machines/bookingMachine';

// Export exact optional versions of types
export type ServiceCategory = ExactOptionalPropertyTypes<BaseServiceCategory>;
export type CardSettings = ExactOptionalPropertyTypes<BaseCardSettings>;
export type NotificationTemplateProps<T> = ExactOptionalPropertyTypes<BaseNotificationTemplateProps<T>>;
export type BookingState = ExactOptionalPropertyTypes<BaseBookingState>;

// Type guard for undefined values
export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

// Helper to safely merge class names
export function mergeClassNames(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(isDefined).filter((cls): cls is string => typeof cls === 'string').join(' ');
}

// Helper to ensure non-undefined string
export function ensureString(value: string | undefined | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value ?? '';
}