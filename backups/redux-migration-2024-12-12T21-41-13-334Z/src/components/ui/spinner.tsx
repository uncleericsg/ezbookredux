import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'yellow';
}

const sizeMap = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export function Spinner({ 
  className, 
  size = 'default', 
  variant = 'default',
  ...props 
}: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        'inline-block',
        sizeMap[size],
        className
      )}
      {...props}
    >
      <div className={cn(
        'w-full h-full border-3 rounded-full animate-spin force-animation',
        variant === 'yellow' 
          ? 'border-yellow-400 border-t-transparent' 
          : variant === 'primary'
            ? 'border-blue-500 border-t-transparent'
            : 'border-gray-300 border-t-transparent dark:border-gray-600'
      )} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
