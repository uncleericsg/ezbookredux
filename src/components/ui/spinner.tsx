import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from './cn';

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
    <motion.div
      role="status"
      className={cn(
        'inline-block',
        sizeMap[size],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...(props as React.ComponentProps<typeof motion.div>)}
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
    </motion.div>
  );
}
