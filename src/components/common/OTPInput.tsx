import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
  isLoading?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onComplete, 
  error, 
  isLoading 
}) => {
  const [otp, setOtp] = useState('');
  const submitRef = useRef(false);

  const handleSubmit = (value: string) => {
    if (value.length === length && !submitRef.current && !isLoading) {
      submitRef.current = true;
      onComplete(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(otp);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, length);
    setOtp(value);
    if (value.length === length) {
      handleSubmit(value);
    } else {
      submitRef.current = false;
    }
  };

  const handleVerifyClick = () => {
    handleSubmit(otp);
  };

  useEffect(() => {
    if (isLoading) {
      submitRef.current = false;
    }
  }, [isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={otp}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={`Enter ${length}-digit OTP`}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-transparent"
          maxLength={length}
          autoFocus
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      
      <button
        type="button"
        onClick={handleVerifyClick}
        disabled={otp.length !== length || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
          ${otp.length === length && !isLoading
            ? 'bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
          } hover:opacity-90`}
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
