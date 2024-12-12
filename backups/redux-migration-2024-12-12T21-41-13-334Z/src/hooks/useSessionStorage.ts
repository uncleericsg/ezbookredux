import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  // Get from session storage
  const getStoredValue = () => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update session storage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  };

  // Clear session storage
  const clearValue = () => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  };

  return [storedValue, setValue, clearValue] as const;
}
