import React, { useCallback, useRef, useEffect } from 'react';
import { useForm } from './context';
import { FormError } from './Form';
import type { ValidationRule } from './context';

export interface CheckboxFieldProps<T extends Record<string, unknown>> {
  /** Field name (must match form values key) */
  name: keyof T;
  
  /** Field label */
  label: string;
  
  /** Description text */
  description?: string;
  
  /** Whether the checkbox is required */
  required?: boolean;
  
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  
  /** Additional validation rules */
  validation?: ValidationRule[];
  
  /** Additional class names */
  className?: string;
  
  /** Class name for the checkbox element */
  checkboxClassName?: string;
  
  /** Class name for the label element */
  labelClassName?: string;
  
  /** Class name for the error element */
  errorClassName?: string;
  
  /** Whether to show validation errors */
  showError?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Callback when checkbox state changes */
  onChange?: (checked: boolean) => void;
}

export function CheckboxField<T extends Record<string, unknown>>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  indeterminate = false,
  validation = [],
  className,
  checkboxClassName,
  labelClassName,
  errorClassName,
  showError = true,
  size = 'md',
  onChange
}: CheckboxFieldProps<T>): React.ReactElement {
  const form = useForm<T>();
  const value = (form.state.values[name] as boolean) || false;
  const errors = form.state.errors[name] || [];
  const touched = form.state.touched[name] || false;
  
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Handle indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    form.handleChange(name, newValue as T[keyof T]);
    onChange?.(newValue);
  }, [form, name, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const newValue = !value;
      form.handleChange(name, newValue as T[keyof T]);
      onChange?.(newValue);
    }
  }, [form, name, onChange, value]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[size];

  return (
    <div className={`${className || ''}`}>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            type="checkbox"
            id={String(name)}
            name={String(name)}
            checked={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => form.handleBlur(name)}
            disabled={disabled}
            required={required}
            aria-describedby={`${String(name)}-description ${String(name)}-error`}
            className={`
              form-checkbox rounded
              text-primary-600
              focus:ring-primary-500
              border-gray-300
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${errors.length > 0 && touched ? 'border-red-500' : ''}
              ${sizeClasses}
              ${checkboxClassName || ''}
            `}
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor={String(name)}
            className={`
              font-medium
              ${disabled ? 'opacity-50' : ''}
              ${labelSizeClasses}
              ${labelClassName || ''}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p
              id={`${String(name)}-description`}
              className="text-gray-500 text-sm"
            >
              {description}
            </p>
          )}
        </div>
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

// Specialized checkbox components
export function ToggleField<T extends Record<string, unknown>>(
  props: Omit<CheckboxFieldProps<T>, 'indeterminate'>
): React.ReactElement {
  return (
    <div className="flex items-center">
      <CheckboxField<T>
        {...props}
        checkboxClassName={`
          relative inline-flex flex-shrink-0
          h-6 w-11 border-2 border-transparent rounded-full
          cursor-pointer transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${props.checkboxClassName || ''}
        `}
      />
      <span className="ml-3">
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </div>
  );
}

export function SwitchField<T extends Record<string, unknown>>(
  props: Omit<CheckboxFieldProps<T>, 'indeterminate'>
): React.ReactElement {
  return (
    <div className="flex items-center">
      <label className="inline-flex relative items-center cursor-pointer">
        <CheckboxField<T>
          {...props}
          checkboxClassName={`
            w-11 h-6
            bg-gray-200
            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300
            dark:peer-focus:ring-primary-800
            rounded-full peer
            dark:bg-gray-700
            peer-checked:after:translate-x-full
            peer-checked:after:border-white
            after:content-['']
            after:absolute
            after:top-[2px]
            after:left-[2px]
            after:bg-white
            after:border-gray-300
            after:border
            after:rounded-full
            after:h-5
            after:w-5
            after:transition-all
            dark:border-gray-600
            peer-checked:bg-primary-600
            ${props.checkboxClassName || ''}
          `}
        />
        <span className="ml-3">
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
    </div>
  );
}