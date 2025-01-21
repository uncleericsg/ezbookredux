import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useForm } from './context';
import { FormError } from './Form';
import type { ValidationRule } from './context';

export interface SelectOption<V> {
  label: string;
  value: V;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectFieldProps<T extends Record<string, unknown>, V> {
  /** Field name (must match form values key) */
  name: keyof T;
  
  /** Field label */
  label: string;
  
  /** Available options */
  options: SelectOption<V>[];
  
  /** Whether multiple selections are allowed */
  multiple?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Additional validation rules */
  validation?: ValidationRule[];
  
  /** Additional class names */
  className?: string;
  
  /** Class name for the select element */
  selectClassName?: string;
  
  /** Class name for the label element */
  labelClassName?: string;
  
  /** Class name for the error element */
  errorClassName?: string;
  
  /** Whether to show validation errors */
  showError?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom option render function */
  renderOption?: (option: SelectOption<V>) => React.ReactNode;
  
  /** Callback when dropdown opens */
  onDropdownOpen?: () => void;
  
  /** Callback when dropdown closes */
  onDropdownClose?: () => void;
}

export function SelectField<T extends Record<string, unknown>, V>({
  name,
  label,
  options,
  multiple = false,
  placeholder,
  required = false,
  disabled = false,
  validation = [],
  className,
  selectClassName,
  labelClassName,
  errorClassName,
  showError = true,
  size = 'md',
  renderOption,
  onDropdownOpen,
  onDropdownClose
}: SelectFieldProps<T, V>): React.ReactElement {
  const form = useForm<T>();
  const value = form.state.values[name] as V | V[] | undefined;
  const errors = form.state.errors[name] || [];
  const touched = form.state.touched[name] || false;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Handle single select change
  const handleSingleSelect = useCallback((option: SelectOption<V>) => {
    if (option.disabled) return;
    form.handleChange(name, option.value as T[keyof T]);
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [form, name]);

  // Handle multiple select change
  const handleMultipleSelect = useCallback((option: SelectOption<V>) => {
    if (option.disabled) return;
    const currentValue = (value as V[]) || [];
    const newValue = currentValue.includes(option.value)
      ? currentValue.filter(v => v !== option.value)
      : [...currentValue, option.value];
    form.handleChange(name, newValue as T[keyof T]);
  }, [form, name, value]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (multiple) {
            handleMultipleSelect(option);
          } else {
            handleSingleSelect(option);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'Tab':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
    }
  }, [disabled, isOpen, focusedIndex, options, multiple, handleSingleSelect, handleMultipleSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notify parent of dropdown state changes
  useEffect(() => {
    if (isOpen) {
      onDropdownOpen?.();
    } else {
      onDropdownClose?.();
    }
  }, [isOpen, onDropdownOpen, onDropdownClose]);

  // Get display value
  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (multiple) {
      const selectedOptions = options.filter(opt => 
        (value as V[]).includes(opt.value)
      );
      return selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(', ')
        : placeholder;
    }

    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-3 px-4'
  }[size];

  return (
    <div className={`relative ${className || ''}`}>
      <label 
        htmlFor={String(name)}
        className={`block text-sm font-medium mb-1 ${labelClassName || ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <button
        ref={triggerRef}
        type="button"
        id={String(name)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        onBlur={() => form.handleBlur(name)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${String(name)}-label`}
        aria-invalid={errors.length > 0}
        aria-describedby={errors.length > 0 ? `${String(name)}-error` : undefined}
        className={`
          w-full text-left rounded-md border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${errors.length > 0 && touched ? 'border-red-500' : ''}
          ${sizeClasses}
          ${selectClassName || ''}
        `}
      >
        {getDisplayValue()}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
          role="listbox"
          aria-multiselectable={multiple}
        >
          {options.map((option, index) => {
            const isSelected = multiple
              ? (value as V[])?.includes(option.value)
              : value === option.value;

            return (
              <div
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => {
                  if (multiple) {
                    handleMultipleSelect(option);
                  } else {
                    handleSingleSelect(option);
                  }
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`
                  px-4 py-2 cursor-pointer
                  ${focusedIndex === index ? 'bg-primary-50' : ''}
                  ${isSelected ? 'bg-primary-100' : ''}
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50'}
                `}
              >
                {renderOption ? renderOption(option) : (
                  <div className="flex items-center">
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="mr-2"
                      />
                    )}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.icon && (
                      <div className="ml-auto">{option.icon}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showError && touched && errors.length > 0 && (
        <FormError
          error={errors[0]}
          className={errorClassName}
        />
      )}
    </div>
  );
}