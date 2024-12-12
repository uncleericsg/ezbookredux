import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import debounce from 'lodash/debounce';

export const phoneRegex = /^[89]\d{7}$/;
export const postalCodeRegex = /^\d{6}$/;

export const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(
      val => /^[89]\d{7}$/.test(val),
      'Mobile number must be 8 digits starting with 8 or 9'
    )
    .transform(val => `+65${val}`),
  floorUnit: z.string()
    .min(1, 'Unit number is required')
    .or(z.literal('NA')),
  blockStreet: z.string().min(1, 'Block and street address is required'),
  postalCode: z.string()
    .min(1, 'Postal code is required')
    .regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  condoName: z.string().optional(),
  lobbyTower: z.string().optional(),
  specialInstructions: z.string().optional()
});

export type FormData = z.infer<typeof formSchema>;

interface ValidationState {
  errors: Partial<Record<keyof FormData, string>>;
  isValid: boolean;
  touched: Set<keyof FormData>;
}

export const useFormValidation = (initialData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [validation, setValidation] = useState<ValidationState>({
    errors: {},
    isValid: false,
    touched: new Set<keyof FormData>()
  });

  const validateForm = useCallback(() => {
    try {
      formSchema.parse(formData);
      setValidation(prev => ({
        ...prev,
        errors: {},
        isValid: true
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            const field = err.path[0] as keyof FormData;
            // Only show error if field has been touched
            if (validation.touched.has(field)) {
              errors[field] = err.message;
            }
          }
        });
        setValidation(prev => ({
          ...prev,
          errors,
          isValid: Object.keys(errors).length === 0
        }));
      }
      return false;
    }
  }, [formData, validation.touched]);

  const validateField = useCallback((field: keyof FormData, value: string) => {
    try {
      formSchema.shape[field].parse(value);
      setValidation(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined },
        touched: new Set([...prev.touched, field])
      }));
      validateForm();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidation(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: err.errors[0].message },
          touched: new Set([...prev.touched, field])
        }));
      }
    }
  }, [validateForm]);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const resetValidation = useCallback(() => {
    setValidation({
      errors: {},
      isValid: false,
      touched: new Set<keyof FormData>()
    });
  }, []);

  const markFieldAsTouched = useCallback((field: keyof FormData) => {
    setValidation(prev => ({
      ...prev,
      touched: new Set([...prev.touched, field])
    }));
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Take only the first 8 digits
    const truncated = digits.slice(0, 8);
    
    // Format as XXXX XXXX if we have more than 4 digits
    if (truncated.length > 4) {
      return `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
    }
    return truncated;
  };

  return {
    formData,
    setFormData,
    validation: {
      ...validation,
      isFieldValid: (field: keyof FormData) => 
        validation.touched.has(field) && !validation.errors[field],
      isFieldTouched: (field: keyof FormData) => 
        validation.touched.has(field),
      getFieldError: (field: keyof FormData) =>
        validation.touched.has(field) ? validation.errors[field] : undefined
    },
    validateForm,
    validateField,
    handleFormChange,
    resetValidation,
    markFieldAsTouched,
    formatPhoneNumber
  };
};
