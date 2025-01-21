import React from 'react';

export interface SelectProps<T extends string> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  onValueChange?: (value: T) => void;
  value?: T;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SelectItemProps<T extends string> extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: T;
  className?: string;
}

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export function Select<T extends string>({ 
  children, 
  onValueChange,
  value,
  ...props 
}: SelectProps<T>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value as T);
  };

  return (
    <select 
      value={value} 
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  children,
  className,
  ...props 
}) => (
  <button 
    type="button"
    className={`inline-flex items-center justify-between px-3 py-2 text-sm ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

export const SelectContent: React.FC<SelectContentProps> = ({ 
  children,
  className,
  ...props 
}) => (
  <div 
    className={`absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);

export function SelectItem<T extends string>({ 
  children,
  className,
  value,
  ...props 
}: SelectItemProps<T>): React.ReactElement {
  return (
    <button 
      type="button"
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${className || ''}`}
      data-value={value}
      {...props}
    >
      {children}
    </button>
  );
}

export const SelectValue: React.FC<SelectValueProps> = ({ 
  children,
  placeholder,
  ...props 
}) => (
  <span {...props}>
    {children || placeholder}
  </span>
);
