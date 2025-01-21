import React, { forwardRef } from 'react';
import { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  error = false,
  placeholder,
  value,
  onChange,
  ...props
}, ref) => {
  const baseStyles = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';

  return (
    <input
      ref={ref}
      className={`${baseStyles} ${errorStyles} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      {...props}
    />
  );
});

Input.displayName = 'Input';
