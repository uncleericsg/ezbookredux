import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isLoading?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);

    if (value.length === length) {
      onComplete(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={length}
        value={otp}
        onChange={handleChange}
        placeholder={`Enter ${length}-digit OTP`}
        className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => onComplete(otp)}
        disabled={otp.length !== length || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
          ${isLoading || otp.length !== length
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            : 'bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black hover:opacity-90'
          }`}
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <p className="text-sm text-gray-400 text-center">
        For testing, use: 123456
      </p>
    </div>
  );
};

// Also export as default for backward compatibility
export default OTPInput;
