import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Additional class names */
  className?: string;
  /** Textarea value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required state */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
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
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
