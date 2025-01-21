import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names */
  className?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  /** Input value */
  value?: string | number;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Required state */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          w-full px-3 py-2 rounded-md border
          focus:outline-none focus:ring-2 focus:ring-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
