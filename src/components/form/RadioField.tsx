import React, { useCallback } from 'react';
import { useForm } from './context';
import { FormError } from './Form';
import type { ValidationRule } from './context';

export interface RadioOption<V> {
  label: string;
  value: V;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioFieldProps<T extends Record<string, unknown>, V> {
  /** Field name (must match form values key) */
  name: keyof T;
  
  /** Field label */
  label: string;
  
  /** Available options */
  options: RadioOption<V>[];
  
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Additional validation rules */
  validation?: ValidationRule[];
  
  /** Additional class names */
  className?: string;
  
  /** Class name for the radio elements */
  radioClassName?: string;
  
  /** Class name for the label element */
  labelClassName?: string;
  
  /** Class name for the error element */
  errorClassName?: string;
  
  /** Whether to show validation errors */
  showError?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom option render function */
  renderOption?: (option: RadioOption<V>, isSelected: boolean) => React.ReactNode;
  
  /** Callback when selection changes */
  onChange?: (value: V) => void;
}

export function RadioField<T extends Record<string, unknown>, V>({
  name,
  label,
  options,
  layout = 'vertical',
  required = false,
  disabled = false,
  validation = [],
  className,
  radioClassName,
  labelClassName,
  errorClassName,
  showError = true,
  size = 'md',
  renderOption,
  onChange
}: RadioFieldProps<T, V>): React.ReactElement {
  const form = useForm<T>();
  const value = form.state.values[name] as V;
  const errors = form.state.errors[name] || [];
  const touched = form.state.touched[name] || false;

  const handleChange = useCallback((option: RadioOption<V>) => {
    if (disabled || option.disabled) return;
    form.handleChange(name, option.value as T[keyof T]);
    onChange?.(option.value);
  }, [form, name, disabled, onChange]);

  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
    option: RadioOption<V>
  ) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange(option);
    }
  }, [handleChange]);

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
      <label className={`block font-medium ${labelSizeClasses}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`mt-2 ${
          layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
        }`}
        role="radiogroup"
        aria-labelledby={`${String(name)}-label`}
      >
        {options.map((option, index) => {
          const isSelected = value === option.value;
          
          return (
            <div
              key={String(option.value)}
              className={`
                relative flex items-start
                ${option.disabled ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={`${String(name)}-${index}`}
                  name={String(name)}
                  value={String(option.value)}
                  checked={isSelected}
                  onChange={() => handleChange(option)}
                  onKeyDown={(e) => handleKeyDown(e, option)}
                  onBlur={() => form.handleBlur(name)}
                  disabled={disabled || option.disabled}
                  required={required}
                  aria-describedby={
                    option.description
                      ? `${String(name)}-${index}-description`
                      : undefined
                  }
                  className={`
                    form-radio
                    text-primary-600
                    focus:ring-primary-500
                    border-gray-300
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    ${errors.length > 0 && touched ? 'border-red-500' : ''}
                    ${sizeClasses}
                    ${radioClassName || ''}
                  `}
                />
              </div>
              <div className="ml-3">
                {renderOption ? (
                  renderOption(option, isSelected)
                ) : (
                  <>
                    <label
                      htmlFor={`${String(name)}-${index}`}
                      className={`
                        font-medium
                        ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${labelClassName || ''}
                      `}
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p
                        id={`${String(name)}-${index}-description`}
                        className="text-gray-500 text-sm"
                      >
                        {option.description}
                      </p>
                    )}
                  </>
                )}
              </div>
              {option.icon && (
                <div className="ml-auto">{option.icon}</div>
              )}
            </div>
          );
        })}
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

// Specialized radio components
export function CardRadioField<T extends Record<string, unknown>, V>(
  props: RadioFieldProps<T, V>
): React.ReactElement {
  return (
    <RadioField<T, V>
      {...props}
      renderOption={(option, isSelected) => (
        <div
          className={`
            p-4 border rounded-lg
            ${option.disabled ? 'opacity-50' : 'hover:border-primary-500'}
            ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
          `}
        >
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="mt-1 text-sm text-gray-500">
              {option.description}
            </div>
          )}
          {option.icon && (
            <div className="mt-2">{option.icon}</div>
          )}
        </div>
      )}
    />
  );
}

export function ButtonRadioField<T extends Record<string, unknown>, V>(
  props: RadioFieldProps<T, V>
): React.ReactElement {
  return (
    <RadioField<T, V>
      {...props}
      layout="horizontal"
      renderOption={(option, isSelected) => (
        <button
          type="button"
          className={`
            px-4 py-2 rounded-md
            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50'}
            ${isSelected ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700'}
          `}
          disabled={option.disabled}
        >
          <div className="flex items-center">
            {option.icon && (
              <span className="mr-2">{option.icon}</span>
            )}
            {option.label}
          </div>
        </button>
      )}
    />
  );
}