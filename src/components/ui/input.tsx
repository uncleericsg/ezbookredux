import * as React from 'react';
import { cn } from '@utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-gray-400',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {typeof error === 'string' && error && (
          <span className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
