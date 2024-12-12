import React, { useState, useEffect } from 'react';

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
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (otp.length === length && !hasSubmitted && !isLoading) {
      setHasSubmitted(true);
      onComplete(otp);
    } else if (otp.length < length) {
      setHasSubmitted(false);
    }
  }, [otp, length, onComplete, isLoading, hasSubmitted]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && otp.length === length && !hasSubmitted && !isLoading) {
      setHasSubmitted(true);
      onComplete(otp);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, length);
    setOtp(value);
  };

  const handleVerifyClick = () => {
    if (otp.length === length && !hasSubmitted && !isLoading) {
      setHasSubmitted(true);
      onComplete(otp);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={length}
          value={otp}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={`Enter ${length}-digit OTP`}
          className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-transparent"
          autoFocus
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      
      <button
        type="button"
        onClick={handleVerifyClick}
        disabled={otp.length !== length || isLoading || hasSubmitted}
        className="w-full py-2 px-4 bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {isLoading ? 'Verifying...' : hasSubmitted ? 'Verified' : 'Verify OTP'}
      </button>

      <p className="text-sm text-gray-400 text-center">
        For testing, use: 123456
      </p>
    </div>
  );
};
