import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseProps {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
}

export interface InputProps extends BaseProps {
  placeholder?: string;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export interface SelectProps extends BaseProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export interface SelectOptionProps extends BaseProps {
  value: string;
}

export interface BadgeProps extends BaseProps {
  variant?: 'default' | 'secondary' | 'destructive';
}

export interface ToastProps extends BaseProps {
  variant?: 'default' | 'destructive';
}

export interface SpinnerProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface CardProps extends BaseProps {}
export interface CardHeaderProps extends BaseProps {}
export interface CardContentProps extends BaseProps {}
export interface CardFooterProps extends BaseProps {}