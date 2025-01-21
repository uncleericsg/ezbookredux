import { useState, useCallback, useEffect } from 'react';
import type { ValidationError } from '../../shared/types/error';
import { logger } from '@/utils/logger';

export interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, ValidationError[]>;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

export interface FormConfig<T extends Record<string, unknown>> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => ValidationError[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, ValidationError[]>;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: (field: keyof T, error: ValidationError) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => ValidationError[];
  validateForm: () => ValidationError[];
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false
}: FormConfig<T>): UseFormReturn<T> {
  const [state, setState] = useState<FormState<T>>(() => ({
    values: initialValues,
    errors: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as Record<keyof T, ValidationError[]>
    ),
    touched: Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    ),
    isDirty: false,
    isSubmitting: false,
    isValid: true,
    submitCount: 0
  }));

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validate) return [];
    
    try {
      const errors = validate(state.values);
      setState(prev => ({
        ...prev,
        errors: errors.reduce((acc, error) => {
          const field = error.field as keyof T;
          return {
            ...acc,
            [field]: [...(acc[field] || []), error]
          };
        }, {} as Record<keyof T, ValidationError[]>),
        isValid: errors.length === 0
      }));
      return errors;
    } catch (error) {
      logger.error('Form validation failed:', error);
      return [];
    }
  }, [validate, state.values]);

  // Validate single field
  const validateField = useCallback((field: keyof T) => {
    if (!validate) return [];

    try {
      const errors = validate(state.values).filter(
        error => error.field === String(field)
      );
      
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: errors
        },
        isValid: Object.values(prev.errors).every(
          fieldErrors => fieldErrors.length === 0
        )
      }));
      
      return errors;
    } catch (error) {
      logger.error(`Field validation failed for ${String(field)}:`, error);
      return [];
    }
  }, [validate, state.values]);

  // Handle field change
  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      isDirty: true
    }));

    if (validateOnChange) {
      validateField(field);
    }
  }, [validateOnChange, validateField]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }));

    if (validateOnBlur) {
      validateField(field);
    }
  }, [validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1
    }));

    const errors = validateForm();
    if (errors.length > 0) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      await onSubmit(state.values);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isDirty: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      throw error;
    }
  }, [onSubmit, state.values, validateForm]);

  // Set field value directly
  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      isDirty: true
    }));
  }, []);

  // Set field error directly
  const setFieldError = useCallback((field: keyof T, error: ValidationError) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: [...(prev.errors[field] || []), error]
      },
      isValid: false
    }));
  }, []);

  // Set field touched state
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: isTouched }
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: [] }),
        {} as Record<keyof T, ValidationError[]>
      ),
      touched: Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      ),
      isDirty: false,
      isSubmitting: false,
      isValid: true,
      submitCount: 0
    });
  }, [initialValues]);

  // Validate on mount if enabled
  useEffect(() => {
    if (validateOnMount) {
      validateForm();
    }
  }, [validateOnMount, validateForm]);

  return {
    ...state,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm
  };
}