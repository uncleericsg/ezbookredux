import type { ReactNode } from 'react';
import type { AppSettings } from '@shared/types/appSettings';
import type { AdminSettings } from '@shared/types/settings';

/**
 * Base props interface for components with loading state
 */
export interface LoadingProps {
  loading: boolean;
}

/**
 * Base props interface for components with save functionality
 */
export interface SaveableProps extends LoadingProps {
  onSave: () => Promise<void>;
}

/**
 * Base props interface for settings components
 */
export interface BaseSettingsProps<T = unknown> extends LoadingProps {
  settings: T;
  updateSettings: (updates: Partial<T>) => void;
}

/**
 * Props interface for components using AppSettings
 */
export interface AppSettingsProps extends SaveableProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

/**
 * Props interface for components using AdminSettings
 */
export interface AdminSettingsProps extends SaveableProps {
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;
}

/**
 * Props interface for section components
 */
export interface SectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

/**
 * Props interface for wrapper components
 */
export interface WrapperProps<T = unknown> {
  children: React.ReactElement;
  settings: T;
  loading: boolean;
  updateSettings: (updates: Partial<T>) => void;
  onSave?: () => Promise<void>;
}

/**
 * Type guard to check if a value is a valid settings object
 */
export function isSettingsObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard to check if an object has the required settings props
 */
export function hasSettingsProps<T>(obj: unknown): obj is BaseSettingsProps<T> {
  if (!isSettingsObject(obj)) return false;
  return (
    'settings' in obj &&
    'updateSettings' in obj &&
    'loading' in obj &&
    typeof obj.updateSettings === 'function'
  );
}

/**
 * Type guard to check if an object has the required saveable props
 */
export function hasSaveableProps(obj: unknown): obj is SaveableProps {
  if (!isSettingsObject(obj)) return false;
  return (
    'loading' in obj &&
    'onSave' in obj &&
    typeof obj.onSave === 'function'
  );
}

/**
 * HOC type for wrapping components with settings functionality
 */
export type WithSettings<P, T> = React.ComponentType<Omit<P, keyof BaseSettingsProps<T>> & WrapperProps<T>>;

/**
 * Utility type for extracting settings type from props
 */
export type SettingsType<P> = P extends BaseSettingsProps<infer T> ? T : never;

/**
 * Utility type for making props optional
 */
export type WithOptionalProps<P extends object, K extends keyof P> = Omit<P, K> & Partial<Pick<P, K>>;

/**
 * Utility type for settings component props with optional save functionality
 */
export type OptionalSaveableProps<P extends { onSave?: () => Promise<void> }> = WithOptionalProps<P, 'onSave'>;

/**
 * Utility type for creating a settings wrapper component
 */
export type SettingsWrapper<P extends object, T> = React.FC<WrapperProps<T> & Omit<P, keyof BaseSettingsProps<T>>>;

/**
 * Type for settings update handler
 */
export type SettingsUpdateHandler<T> = (updates: Partial<T>) => void;

/**
 * Type for save handler
 */
export type SaveHandler = () => Promise<void>;

/**
 * Utility function to create settings props
 */
export function createSettingsProps<T>(
  settings: T,
  loading: boolean,
  updateSettings: SettingsUpdateHandler<T>,
  onSave?: SaveHandler
): BaseSettingsProps<T> & { onSave?: SaveHandler } {
  return {
    settings,
    loading,
    updateSettings,
    ...(onSave && { onSave })
  };
}

/**
 * Type for component with settings
 */
export type ComponentWithSettings<T> = React.FC<BaseSettingsProps<T>>;

/**
 * Type for component with saveable settings
 */
export type ComponentWithSaveableSettings<T> = React.FC<BaseSettingsProps<T> & SaveableProps>;

/**
 * Type for settings section props
 */
export interface SettingsSectionProps extends SectionProps {
  children: React.ReactElement;
}

/**
 * Type guard to check if a component has settings props
 */
export function isComponentWithSettings<T>(
  component: React.ComponentType<any>
): component is ComponentWithSettings<T> {
  if (!component || !('propTypes' in component)) return false;
  const propTypes = component.propTypes;
  return !!(
    propTypes &&
    'settings' in propTypes &&
    'updateSettings' in propTypes
  );
}

/**
 * Type guard to check if a component has saveable settings props
 */
export function isComponentWithSaveableSettings<T>(
  component: React.ComponentType<any>
): component is ComponentWithSaveableSettings<T> {
  if (!isComponentWithSettings<T>(component)) return false;
  const propTypes = component.propTypes;
  return !!(propTypes && 'onSave' in propTypes);
}
