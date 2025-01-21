import * as React from 'react';
import { cn } from '@utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
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
Textarea.displayName = 'Textarea';

export { Textarea };
