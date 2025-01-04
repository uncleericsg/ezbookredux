import { useState, useCallback } from 'react';
import type { ValidationState, FormValidation } from '../types';

export const useFormValidation = () => {
  const [validation, setValidation] = useState<FormValidation>({
    firstName: { touched: false, valid: false },
    lastName: { touched: false, valid: false },
    email: { touched: false, valid: false },
    mobile: { touched: false, valid: false },
    address: { touched: false, valid: false },
    postalCode: { touched: false, valid: false },
    unit: { touched: false, valid: false },
    buildingName: { touched: false, valid: true }, // Optional field
    lobbyTower: { touched: false, valid: true },   // Optional field
  });

  const validateField = useCallback((name: string, value: string): ValidationState => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return {
          touched: true,
          valid: value.length >= 2,
          error: value.length < 2 ? 'Must be at least 2 characters' : undefined
        };
      case 'email': {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidFormat = emailRegex.test(value);
        return {
          touched: true,
          valid: isValidFormat,
          error: !isValidFormat ? 'Please enter a valid email address' : undefined
        };
      }
      case 'mobile':
        const digitsOnly = value.replace(/\D/g, '');
        const mobileRegex = /^[89]\d{7}$/;
        return {
          touched: true,
          valid: mobileRegex.test(digitsOnly),
          error: !mobileRegex.test(digitsOnly) ? 'Must be 8 digits starting with 8 or 9' : undefined
        };
      case 'address':
        return {
          touched: true,
          valid: value.length > 0,
          error: value.length === 0 ? 'Address is required' : undefined
        };
      case 'postalCode':
        const postalRegex = /^[0-9]{6}$/;
        return {
          touched: true,
          valid: postalRegex.test(value),
          error: !postalRegex.test(value) ? 'Invalid postal code' : undefined
        };
      case 'unit':
        return {
          touched: true,
          valid: value.length > 0,
          error: value.length === 0 ? 'Unit number is required' : undefined
        };
      case 'buildingName':
      case 'lobbyTower':
        return {
          touched: true,
          valid: true // Optional fields are always valid
        };
      default:
        return { touched: true, valid: true };
    }
  }, []);

  const isFormValid = useCallback((): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'address', 'postalCode', 'unit'];
    return requiredFields.every(field => validation[field as keyof FormValidation].valid);
  }, [validation]);

  const updateValidation = useCallback((name: string, value: string) => {
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  }, [validateField]);

  return {
    validation,
    validateField,
    isFormValid,
    updateValidation,
    setValidation
  };
};

export default useFormValidation;