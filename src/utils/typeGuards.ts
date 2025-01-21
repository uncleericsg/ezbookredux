import type { 
  BaseSettingsProps, 
  SaveableProps, 
  AppSettingsProps,
  AdminSettingsProps,
  ComponentWithSettings,
  ComponentWithSaveableSettings
} from '@/types/components';
import type { AppSettings } from '@shared/types/appSettings';
import type { AdminSettings } from '@shared/types/settings';

/**
 * Type guard to check if a value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard to check if a value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Type guard to check if a value is a promise
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise;
}

/**
 * Type guard to check if a value has the required settings props
 */
export function hasSettingsProps<T>(value: unknown): value is BaseSettingsProps<T> {
  if (!isObject(value)) return false;
  
  const { settings, updateSettings, loading } = value as Partial<BaseSettingsProps<T>>;
  
  return (
    settings !== undefined &&
    typeof loading === 'boolean' &&
    isFunction(updateSettings)
  );
}

/**
 * Type guard to check if a value has the required saveable props
 */
export function hasSaveableProps(value: unknown): value is SaveableProps {
  if (!isObject(value)) return false;
  
  const obj = value as Partial<SaveableProps>;
  
  if (
    typeof obj.loading !== 'boolean' ||
    !isFunction(obj.onSave)
  ) {
    return false;
  }

  try {
    const saveResult = obj.onSave();
    return isPromise(saveResult);
  } catch {
    return false;
  }
}

/**
 * Type guard to check if a value is AppSettings
 */
export function isAppSettings(value: unknown): value is AppSettings {
  if (!isObject(value)) return false;
  
  const settings = value as Partial<AppSettings>;
  
  return (
    typeof settings.loginScreenEnabled === 'boolean' &&
    isObject(settings.chatGPTSettings) &&
    isObject(settings.cypressSettings) &&
    isObject(settings.stripeSettings) &&
    isObject(settings.repairShoprSettings)
  );
}

/**
 * Type guard to check if a value is AdminSettings
 */
export function isAdminSettings(value: unknown): value is AdminSettings {
  if (!isObject(value)) return false;
  
  const settings = value as Partial<AdminSettings>;
  
  return (
    isObject(settings.integrations) &&
    isObject(settings.branding) &&
    isAppSettings(settings.app)
  );
}

/**
 * Type guard to check if a value has AppSettings props
 */
export function hasAppSettingsProps(value: unknown): value is AppSettingsProps {
  if (!hasSettingsProps<AppSettings>(value)) return false;
  if (!hasSaveableProps(value)) return false;
  
  return isAppSettings(value.settings);
}

/**
 * Type guard to check if a value has AdminSettings props
 */
export function hasAdminSettingsProps(value: unknown): value is AdminSettingsProps {
  if (!hasSettingsProps<AdminSettings>(value)) return false;
  if (!hasSaveableProps(value)) return false;
  
  return isAdminSettings(value.settings);
}

/**
 * Type guard to check if a component is a settings component
 */
export function isSettingsComponent<T>(
  component: unknown
): component is ComponentWithSettings<T> {
  if (!isObject(component) || !('propTypes' in component)) return false;
  
  const props = (component as any).propTypes;
  return !!(
    props &&
    'settings' in props &&
    'updateSettings' in props &&
    'loading' in props
  );
}

/**
 * Type guard to check if a component is a saveable settings component
 */
export function isSaveableSettingsComponent<T>(
  component: unknown
): component is ComponentWithSaveableSettings<T> {
  return isSettingsComponent<T>(component) && 
    !!(component as any).propTypes?.onSave;
}

/**
 * Validate settings object structure
 */
export function validateSettings<T extends object>(
  settings: unknown,
  requiredKeys: Array<keyof T>
): settings is T {
  if (!isObject(settings)) return false;
  
  return requiredKeys.every(key => key in settings);
}

/**
 * Validate settings update function
 */
export function validateSettingsUpdate<T>(
  updateFn: unknown
): updateFn is (updates: Partial<T>) => void {
  if (!isFunction(updateFn)) return false;
  try {
    updateFn({});
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate save handler
 */
export function validateSaveHandler(
  saveHandler: unknown
): saveHandler is () => Promise<void> {
  if (!isFunction(saveHandler)) return false;
  try {
    const result = saveHandler();
    return isPromise(result);
  } catch {
    return false;
  }
}

/**
 * Validate component props
 */
export function validateComponentProps<T extends object>(
  props: unknown,
  requiredProps: Array<keyof T>
): props is T {
  if (!isObject(props)) return false;
  return requiredProps.every(prop => prop in props);
}

/**
 * Type assertion helper for settings components
 */
export function assertSettingsComponent<T>(
  component: unknown,
  message = 'Invalid settings component'
): asserts component is ComponentWithSettings<T> {
  if (!isSettingsComponent<T>(component)) {
    throw new Error(message);
  }
}

/**
 * Type assertion helper for saveable settings components
 */
export function assertSaveableSettingsComponent<T>(
  component: unknown,
  message = 'Invalid saveable settings component'
): asserts component is ComponentWithSaveableSettings<T> {
  if (!isSaveableSettingsComponent<T>(component)) {
    throw new Error(message);
  }
}
