import React from 'react';
import { ToastProps } from './types';

export const Toast: React.FC<ToastProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const baseStyles = 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all';
  
  const variantStyles = {
    default: 'bg-background border',
    destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};
