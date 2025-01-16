import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
} & ComponentPropsWithoutRef<T>;

export type InputProps<T extends ElementType = 'input'> = {
  as?: T;
  label?: string;
  error?: string;
  loading?: boolean;
} & ComponentPropsWithoutRef<T>;

export type SelectProps<T extends ElementType = 'select'> = {
  as?: T;
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
} & ComponentPropsWithoutRef<T>;

export type TextareaProps<T extends ElementType = 'textarea'> = {
  as?: T;
  label?: string;
  error?: string;
  rows?: number;
} & ComponentPropsWithoutRef<T>;

export type FormProps<T extends ElementType = 'form'> = {
  as?: T;
  onSubmit?: (e: React.FormEvent) => void;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;