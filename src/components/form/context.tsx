import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ValidationError } from '../../../shared/types/error';
import type { ServiceError } from '../../../types/api';

// Form field validation rule
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

// Form state
export interface FormState<T> {
  values: Partial<T>;
  errors: Record<keyof T, ValidationError[]>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

// Form context value
export interface FormContextValue<T> {
  state: FormState<T>;
  handleChange: <K extends keyof T>(name: K, value: T[K]) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setFieldError: (name: keyof T, error: ValidationError) => void;
  resetForm: () => void;
  validateField: (name: keyof T) => ValidationError[];
  validateForm: () => ValidationError[];
}

// Form provider props
export interface FormProviderProps<T> {
  initialValues: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  onError?: (error: ServiceError) => void;
  children: (context: FormContextValue<T>) => React.ReactElement;
  validation?: {
    [K in keyof T]?: ValidationRule[];
  };
}

// Form actions
type FormAction<T> =
  | { type: 'SET_VALUE'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_ERROR'; field: keyof T; error: ValidationError }
  | { type: 'SET_TOUCHED'; field: keyof T }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: ServiceError }
  | { type: 'RESET_FORM' };

// Create form context with explicit type parameter
const FormContext = createContext<FormContextValue<any> | null>(null);

// Form reducer
function formReducer<T>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: [
            ...(state.errors[action.field] || []),
            action.error
          ]
        }
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        submitCount: state.submitCount + 1
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        errors: {} as Record<keyof T, ValidationError[]>
      };
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false
      };
    case 'RESET_FORM':
      return {
        values: {} as Partial<T>,
        errors: {} as Record<keyof T, ValidationError[]>,
        touched: {} as Record<keyof T, boolean>,
        isSubmitting: false,
        isValid: true,
        submitCount: 0
      };
    default:
      return state;
  }
}

// Form provider component
export function FormProvider<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  onError,
  children,
  validation
}: FormProviderProps<T>): React.ReactElement {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {} as Record<keyof T, ValidationError[]>,
    touched: {} as Record<keyof T, boolean>,
    isSubmitting: false,
    isValid: true,
    submitCount: 0
  });

  const validateField = useCallback(
    (name: keyof T) => {
      const rules = validation?.[name] || [];
      const value = state.values[name];
      const errors: ValidationError[] = [];

      rules.forEach(rule => {
        let isValid = true;

        switch (rule.type) {
          case 'required':
            isValid = value !== undefined && value !== null && value !== '';
            break;
          case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
            break;
          case 'minLength':
            isValid = String(value).length >= (rule.value as number);
            break;
          case 'maxLength':
            isValid = String(value).length <= (rule.value as number);
            break;
          case 'pattern':
            isValid = (rule.value as RegExp).test(String(value));
            break;
          case 'custom':
            isValid = rule.validate?.(value) ?? true;
            break;
        }

        if (!isValid) {
          errors.push({
            field: String(name),
            message: rule.message,
            type: rule.type,
            code: 'VALIDATION_ERROR'
          });
        }
      });

      return errors;
    },
    [validation, state.values]
  );

  const validateForm = useCallback(() => {
    const allErrors: ValidationError[] = [];
    Object.keys(validation || {}).forEach(field => {
      const fieldErrors = validateField(field as keyof T);
      allErrors.push(...fieldErrors);
    });
    return allErrors;
  }, [validateField, validation]);

  const handleChange = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    dispatch({ type: 'SET_VALUE', field: name, value });
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    dispatch({ type: 'SET_TOUCHED', field: name });
    const errors = validateField(name);
    errors.forEach(error => {
      dispatch({ type: 'SET_ERROR', field: name, error });
    });
  }, [validateField]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch({ type: 'SUBMIT_START' });

      const errors = validateForm();
      if (errors.length > 0) {
        dispatch({ 
          type: 'SUBMIT_ERROR',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Form validation failed',
            details: { errors }
          }
        });
        onError?.({
          code: 'VALIDATION_ERROR',
          message: 'Form validation failed',
          details: { errors }
        });
        return;
      }

      try {
        await onSubmit(state.values as T);
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } catch (error) {
        const serviceError = error as ServiceError;
        dispatch({ type: 'SUBMIT_ERROR', error: serviceError });
        onError?.(serviceError);
      }
    },
    [state.values, validateForm, onSubmit, onError]
  );

  const contextValue: FormContextValue<T> = {
    state,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue: handleChange,
    setFieldError: (name: keyof T, error: ValidationError) => 
      dispatch({ type: 'SET_ERROR', field: name, error }),
    resetForm: () => dispatch({ type: 'RESET_FORM' }),
    validateField,
    validateForm
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children(contextValue)}
    </FormContext.Provider>
  );
}

// Custom hook to use form context
export function useForm<T extends Record<string, unknown>>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context as FormContextValue<T>;
}