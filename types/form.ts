import type { ValidationError } from '../shared/types/error';
import type { ServiceError } from './api';

// Form field validation rules
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: number | string | RegExp;
  validate?: (value: unknown) => boolean;
}

// Form field configuration
export interface FieldConfig<T extends Record<string, unknown>> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  defaultValue?: T[keyof T];
  validation?: ValidationRule[];
  options?: Array<{
    label: string;
    value: string | number | boolean;
  }>;
  disabled?: boolean;
  required?: boolean;
}

// Form configuration
export interface FormConfig<T extends Record<string, unknown>> {
  fields: FieldConfig<T>[];
  initialValues: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  onError?: (error: ServiceError) => void;
}

// Form state
export interface FormState<T extends Record<string, unknown>> {
  values: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

// Form context
export interface FormContext<T extends Record<string, unknown>> {
  state: FormState<T>;
  handleChange: (name: keyof T, value: T[keyof T]) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  setFieldError: (name: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (name: keyof T) => ValidationError[];
  validateForm: () => ValidationError[];
}

// Form field props
export interface FieldProps<T extends Record<string, unknown>> {
  name: keyof T;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (value: T[keyof T]) => void;
  onBlur?: () => void;
}

// Form component props
export interface FormProps<T extends Record<string, unknown>> {
  config: FormConfig<T>;
  children: React.ReactNode;
  className?: string;
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Form submission state
export interface SubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  submitError?: ServiceError;
}

// Form field validation state
export interface FieldValidationState {
  isValid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  errors: ValidationError[];
}

// Form validation context
export interface ValidationContext<T extends Record<string, unknown>> {
  validateField: (name: keyof T, value: T[keyof T]) => ValidationError[];
  validateForm: (values: Partial<T>) => ValidationError[];
  getFieldValidationState: (name: keyof T) => FieldValidationState;
  setFieldTouched: (name: keyof T) => void;
  clearValidation: () => void;
}

// Helper function types
export type ValidateFunction<T> = (value: T) => ValidationError[];
export type TransformFunction<T> = (value: T) => T;
export type AsyncValidateFunction<T> = (value: T) => Promise<ValidationError[]>;

// Form action types
export type FormAction<T extends Record<string, unknown>> =
  | { type: 'SET_VALUE'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_ERROR'; field: keyof T; error: string }
  | { type: 'SET_TOUCHED'; field: keyof T }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: ServiceError }
  | { type: 'RESET_FORM' };