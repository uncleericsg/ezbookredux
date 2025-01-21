import type { ReactElement, ChangeEvent } from 'react';
import { useCallback } from 'react';
import { useForm } from './context';
import { FormError } from './Form';
import type { ValidationRule } from './context';

export interface DateFieldProps<T extends Record<string, unknown>> {
  /** Field name (must match form values key) */
  name: keyof T;
  
  /** Field label */
  label: string;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Additional validation rules */
  validation?: ValidationRule[];
  
  /** Additional class names */
  className?: string;
  
  /** Class name for the input element */
  inputClassName?: string;
  
  /** Class name for the label element */
  labelClassName?: string;
  
  /** Class name for the error element */
  errorClassName?: string;
  
  /** Whether to show validation errors */
  showError?: boolean;
  
  /** Minimum date */
  min?: string;
  
  /** Maximum date */
  max?: string;
  
  /** Date format */
  format?: string;
  
  /** Callback when date changes */
  onChange?: (value: string) => void;
}

export function DateField<T extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  validation = [],
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  showError = true,
  min,
  max,
  format = 'YYYY-MM-DD',
  onChange
}: DateFieldProps<T>): React.ReactElement {
  const form = useForm<T>();
  const value = (form.state.values[name] as string) || '';
  const errors = form.state.errors[name] || [];
  const touched = form.state.touched[name] || false;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    form.handleChange(name, newValue as T[keyof T]);
    onChange?.(newValue);
  }, [form, name, onChange]);

  const formatDate = useCallback((date: string) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      // Format based on the format prop
      // For now, we'll just use ISO format
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }, []);

  return (
    <div className={`${className || ''}`}>
      <label
        htmlFor={String(name)}
        className={`block text-sm font-medium text-gray-700 ${labelClassName || ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">
        <input
          type="date"
          id={String(name)}
          name={String(name)}
          value={formatDate(value)}
          onChange={handleChange}
          onBlur={() => form.handleBlur(name)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          className={`
            block w-full px-3 py-2
            border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${errors.length > 0 && touched ? 'border-red-500' : ''}
            ${inputClassName || ''}
          `}
          aria-invalid={errors.length > 0}
          aria-describedby={errors.length > 0 ? `${String(name)}-error` : undefined}
        />
      </div>
      {showError && touched && errors.length > 0 && (
        <FormError
          error={errors[0]}
          className={`mt-1 ${errorClassName || ''}`}
        />
      )}
    </div>
  );
}