import { useState, useEffect } from 'react';
import { FormData } from './useFormValidation';

const FORM_STORAGE_KEY = 'customerFormData';
const RECENT_ADDRESSES_KEY = 'recentAddresses';
const MAX_RECENT_ADDRESSES = 5;

interface FormPersistenceOptions {
  rememberDetails?: boolean;
}

export const useFormPersistence = (initialData: FormData) => {
  const [savedAddresses, setSavedAddresses] = useState<Partial<FormData>[]>([]);
  
  const saveFormData = (data: FormData) => {
    // Do nothing - disabled form persistence
  };

  const clearSavedData = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(RECENT_ADDRESSES_KEY);
    setSavedAddresses([]);
  };

  return {
    savedAddresses: [], // Return empty array to disable address suggestions
    saveFormData,
    clearSavedData
  };
};
