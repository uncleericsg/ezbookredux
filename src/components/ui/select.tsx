import React, { forwardRef } from 'react';
import { SelectProps } from './types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  error = false,
  children,
  value,
  onChange,
  ...props
}, ref) => {
  const baseStyles = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';

  return (
    <select
      ref={ref}
      className={`${baseStyles} ${errorStyles} ${className}`}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
