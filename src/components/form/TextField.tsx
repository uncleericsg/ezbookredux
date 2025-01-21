import type { ReactElement, InputHTMLAttributes, ChangeEvent } from 'react';
import { useCallback } from 'react';
import { useForm } from './context';
import { FormError } from './Form';
import type { ValidationRule } from './context';

export interface TextFieldProps<T extends Record<string, unknown>> {
  /** Field name (must match form values key) */
  name: keyof T;
  
  /** Field label */
  label: string;
  
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  
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
  
  /** Additional props for the input element */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export function TextField<T extends Record<string, unknown>>({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  validation = [],
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  showError = true,
  inputProps = {}
}: TextFieldProps<T>): React.ReactElement {
  const form = useForm<T>();
  const value = (form.state.values[name] as string) || '';
  const errors = form.state.errors[name] || [];
  const touched = form.state.touched[name] || false;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? 
      e.target.value === '' ? '' : Number(e.target.value) : 
      e.target.value;
    form.handleChange(name, newValue as T[keyof T]);
  }, [form, name, type]);

  const handleBlur = useCallback(() => {
    form.handleBlur(name);
  }, [form, name]);

  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <label 
        htmlFor={String(name)}
        className={`text-sm font-medium ${labelClassName || ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={String(name)}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || form.state.isSubmitting}
        className={`
          px-3 py-2 rounded-md border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${errors.length > 0 && touched ? 'border-red-500' : ''}
          ${inputClassName || ''}
        `}
        aria-invalid={errors.length > 0}
        aria-describedby={errors.length > 0 ? `${String(name)}-error` : undefined}
        required={required}
        {...inputProps}
      />

      {showError && touched && errors.length > 0 && (
        <FormError
          error={errors[0]}
          className={errorClassName}
        />
      )}
    </div>
  );
}

// Specialized text field components
export function EmailField<T extends Record<string, unknown>>(
  props: Omit<TextFieldProps<T>, 'type'>
): React.ReactElement {
  return (
    <TextField<T>
      {...props}
      type="email"
      validation={[
        {
          type: 'email',
          message: 'Please enter a valid email address',
        },
        ...(props.validation || []),
      ]}
    />
  );
}

export function PasswordField<T extends Record<string, unknown>>(
  props: Omit<TextFieldProps<T>, 'type'>
): React.ReactElement {
  return (
    <TextField<T>
      {...props}
      type="password"
      validation={[
        {
          type: 'minLength',
          value: 8,
          message: 'Password must be at least 8 characters',
        },
        ...(props.validation || []),
      ]}
    />
  );
}

export function PhoneField<T extends Record<string, unknown>>(
  props: Omit<TextFieldProps<T>, 'type'>
): React.ReactElement {
  return (
    <TextField<T>
      {...props}
      type="tel"
      validation={[
        {
          type: 'pattern',
          value: /^\+?[1-9]\d{1,14}$/,
          message: 'Please enter a valid phone number',
        },
        ...(props.validation || []),
      ]}
    />
  );
}

export function NumberField<T extends Record<string, unknown>>(
  props: Omit<TextFieldProps<T>, 'type'> & {
    min?: number;
    max?: number;
    step?: number;
  }
): React.ReactElement {
  const { min, max, step, ...rest } = props;
  
  const numberValidation: ValidationRule[] = [
    ...(min !== undefined ? [{
      type: 'custom',
      message: `Value must be at least ${min}`,
      validate: (value: unknown) => {
        const num = Number(value);
        return !isNaN(num) && num >= min;
      }
    } as ValidationRule] : []),
    ...(max !== undefined ? [{
      type: 'custom',
      message: `Value must be at most ${max}`,
      validate: (value: unknown) => {
        const num = Number(value);
        return !isNaN(num) && num <= max;
      }
    } as ValidationRule] : []),
    ...(props.validation || [])
  ];

  return (
    <TextField<T>
      {...rest}
      type="number"
      inputProps={{
        min,
        max,
        step,
      }}
      validation={numberValidation}
    />
  );
}