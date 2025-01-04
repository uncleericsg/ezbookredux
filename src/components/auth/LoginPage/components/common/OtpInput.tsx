import React, { useCallback } from 'react';
import { getStyle, cn } from '../../styles/common';
import { VALIDATION } from '../../constants';
import type { OtpInputProps } from '../../types';

/**
 * OTP input component with auto-verification support
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  maxLength = VALIDATION.OTP.LENGTH,
  autoFocus = false,
  disabled = false,
  className
}) => {
  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    onChange(newValue);
  }, [maxLength, onChange]);

  // Handle paste event
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericValue = pastedData.replace(/\D/g, '').slice(0, maxLength);
    onChange(numericValue);
  }, [maxLength, onChange]);

  return (
    <div className={cn('relative', className)}>
      <input
        type="tel"
        inputMode="numeric"
        pattern={VALIDATION.OTP.PATTERN}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        maxLength={maxLength}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn(
          getStyle('inputs', 'base'),
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          'text-center tracking-widest'
        )}
        placeholder={'•'.repeat(maxLength)}
      />
      
      {/* Visual OTP Dots */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-around items-center px-3">
        {Array.from({ length: maxLength }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index < value.length
                ? 'bg-[#FFD700] scale-110'
                : 'bg-gray-600 scale-100'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;