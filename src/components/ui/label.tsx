import React, { forwardRef } from 'react';
import { BaseProps } from './types';

interface LabelProps extends BaseProps {
  htmlFor?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  className = '',
  children,
  htmlFor,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';
