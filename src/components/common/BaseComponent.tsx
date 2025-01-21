import React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { mergeClassNames, ensureString } from '@/types/exactOptional';
import type { ExactOptionalPropertyTypes } from '@/types/exactOptional';

// Base component props that all components should extend
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'data-testid'?: string;
}

// Props that include data
export interface DataProps<T> extends BaseProps {
  data?: T;
}

// Base form component props
export interface BaseFormComponentProps<T> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
}

// Props for form components with exact optional types
export type FormComponentProps<T> = ExactOptionalPropertyTypes<BaseFormComponentProps<T> & BaseProps>;

// Props for list components
export interface ListComponentProps<T> extends BaseProps {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  loadingComponent?: ReactNode;
  onItemClick?: (item: T, index: number) => void;
}

// Props for container components
export interface ContainerProps extends BaseProps {
  fluid?: boolean;
  as?: keyof JSX.IntrinsicElements;
  padding?: boolean | string;
  margin?: boolean | string;
  maxWidth?: string;
}

// Props for button components
export interface ButtonProps extends BaseProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Base component type
export type Component<P = {}> = React.FC<ExactOptionalPropertyTypes<P & BaseProps>>;

// Form component type
export type FormComponent<T> = React.FC<FormComponentProps<T>>;

// List component type
export type ListComponent<T> = React.FC<ExactOptionalPropertyTypes<ListComponentProps<T>>>;

// Container component type
export type ContainerComponent = React.FC<ExactOptionalPropertyTypes<ContainerProps>>;

// Button component type
export type ButtonComponent = React.FC<ExactOptionalPropertyTypes<ButtonProps>>;

// Base component implementation
export const BaseComponent: Component = ({
  className,
  style,
  children,
  ...props
}) => (
  <div className={mergeClassNames('', className)} style={style} {...props}>
    {children}
  </div>
);

// Form component implementation
export function createFormComponent<T>(
  render: (props: FormComponentProps<T>) => ReactNode
): FormComponent<T> {
  return function FormComponent({
    className,
    style,
    children,
    error,
    helperText,
    label,
    required,
    ...props
  }) {
    const formProps: FormComponentProps<T> = {
      ...props,
      error,
      helperText,
      label,
      required
    };

    return (
      <div className={mergeClassNames('form-control', className)} style={style}>
        {label && (
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          </label>
        )}
        {render(formProps)}
        {(error || helperText) && (
          <label className="label">
            <span className={mergeClassNames('label-text-alt', error ? 'text-error' : '')}>
              {error || helperText}
            </span>
          </label>
        )}
        {children}
      </div>
    );
  };
}

// List component implementation
export function createListComponent<T>(
  defaultEmptyMessage: string = 'No items found'
): ListComponent<T> {
  return function ListComponent({
    className,
    style,
    items,
    renderItem,
    keyExtractor = (_, index) => String(index),
    emptyMessage = defaultEmptyMessage,
    loading,
    loadingComponent,
    onItemClick,
    children,
    ...props
  }) {
    if (loading && loadingComponent) {
      return <>{loadingComponent}</>;
    }

    if (items.length === 0) {
      return <div className="text-center py-4">{emptyMessage}</div>;
    }

    return (
      <div className={mergeClassNames('space-y-2', className)} style={style} {...props}>
        {items.map((item, index) => (
          <div
            key={keyExtractor(item, index)}
            onClick={() => onItemClick?.(item, index)}
            className={onItemClick ? 'cursor-pointer' : undefined}
          >
            {renderItem(item, index)}
          </div>
        ))}
        {children}
      </div>
    );
  };
}

// Container component implementation
export const Container: ContainerComponent = ({
  className,
  style,
  children,
  fluid,
  as: Component = 'div',
  padding = true,
  margin = true,
  maxWidth = 'max-w-7xl',
  ...props
}) => (
  <Component
    className={mergeClassNames(
      fluid ? 'w-full' : maxWidth,
      padding ? ensureString(padding) === 'true' ? 'px-4' : ensureString(padding) : '',
      margin ? ensureString(margin) === 'true' ? 'mx-auto' : ensureString(margin) : '',
      className
    )}
    style={style}
    {...props}
  >
    {children}
  </Component>
);

// Button component implementation
export const Button: ButtonComponent = ({
  className,
  style,
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => (
  <button
    type={type}
    className={mergeClassNames(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      loading ? 'loading' : '',
      className
    )}
    style={style}
    disabled={disabled || loading}
    onClick={onClick}
    {...props}
  >
    {icon && iconPosition === 'left' && (
      <span className="mr-2">{icon}</span>
    )}
    {children}
    {icon && iconPosition === 'right' && (
      <span className="ml-2">{icon}</span>
    )}
  </button>
);