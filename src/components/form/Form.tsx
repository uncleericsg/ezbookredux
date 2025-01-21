import type { ReactElement, ReactNode, ButtonHTMLAttributes, MouseEvent } from 'react';
import type { ServiceError } from '@/types/api';
import type { ValidationError } from '@shared/types/error';
import { FormProvider } from './context';
import type { FormContextValue, ValidationRule } from './context';

export interface FormProps<T extends Record<string, unknown>> {
  /** Initial form values */
  initialValues: Partial<T>;
  
  /** Form submission handler */
  onSubmit: (values: T) => Promise<void>;
  
  /** Error handler */
  onError?: (error: ServiceError) => void;
  
  /** Form validation rules */
  validation?: {
    [K in keyof T]?: ValidationRule[];
  };
  
  /** Form children (fields, buttons, etc.) */
  children: ReactNode | ((form: FormContextValue<T>) => ReactNode);
  
  /** Additional class names */
  className?: string;
  
  /** Whether to disable the form */
  disabled?: boolean;
  
  /** Whether to show validation errors immediately */
  validateOnMount?: boolean;
  
  /** Whether to show validation errors on change */
  validateOnChange?: boolean;
  
  /** Whether to show validation errors on blur */
  validateOnBlur?: boolean;
}

export function Form<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  onError,
  validation,
  children,
  className,
  disabled,
  validateOnMount = false,
  validateOnChange = true,
  validateOnBlur = true
}: FormProps<T>): React.ReactElement {
  const renderChildren = (context: FormContextValue<T>): React.ReactElement => (
    <form
      className={className}
      onSubmit={context.handleSubmit}
      noValidate
    >
      <fieldset disabled={disabled || context.state.isSubmitting}>
        {typeof children === 'function' ? children(context) : children}
      </fieldset>
    </form>
  );

  return (
    <FormProvider<T>
      initialValues={initialValues}
      onSubmit={onSubmit}
      onError={onError}
      validation={validation}
    >
      {renderChildren}
    </FormProvider>
  );
}

// Error display component
interface FormErrorProps {
  error?: ValidationError;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps): React.ReactElement | null {
  if (!error) return null;

  return (
    <div className={`text-red-500 text-sm mt-1 ${className || ''}`}>
      {error.message}
    </div>
  );
}

// Loading indicator component
interface FormLoadingProps {
  loading?: boolean;
  className?: string;
}

export function FormLoading({ loading, className }: FormLoadingProps): React.ReactElement | null {
  if (!loading) return null;

  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
    </div>
  );
}

// Submit button component
interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function FormSubmit({
  children,
  loading,
  loadingText = 'Submitting...',
  disabled,
  className,
  ...props
}: FormSubmitProps): React.ReactElement {
  return (
    <button
      type="submit"
      className={`flex items-center justify-center ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <FormLoading loading={true} className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Reset button component
interface FormResetProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmText?: string;
}

export function FormReset({
  children,
  confirmText = 'Are you sure you want to reset the form?',
  onClick,
  ...props
}: FormResetProps): React.ReactElement {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.confirm(confirmText)) {
      onClick?.(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}