import React from 'react';
import { BaseProps } from './types';

interface AlertProps extends BaseProps {
  variant?: 'default' | 'destructive';
}

interface AlertTitleProps extends BaseProps {}

interface AlertDescriptionProps extends BaseProps {}

export const Alert: React.FC<AlertProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-background text-foreground',
    destructive: 'bg-destructive/15 text-destructive dark:bg-destructive/20'
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className = ''
}) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};