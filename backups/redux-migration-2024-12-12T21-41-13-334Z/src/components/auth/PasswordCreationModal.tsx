import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, XCircle } from 'lucide-react';

interface PasswordCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  email: string;
}

const PasswordCreationModal: React.FC<PasswordCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  email,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });

  useEffect(() => {
    // Update requirements whenever password changes
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
      match: password === confirmPassword && password !== ''
    });
  }, [password, confirmPassword]);

  const validatePassword = (pass: string) => {
    return requirements.length && 
           requirements.uppercase && 
           requirements.lowercase && 
           requirements.number && 
           requirements.special;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!validatePassword(password)) {
        setError('Please meet all password requirements');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const success = await onSubmit(password);
      if (success) {
        // Wait briefly to ensure user data is persisted
        await new Promise(resolve => setTimeout(resolve, 100));
        onClose();
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm ${met ? 'text-green-500' : 'text-red-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-center w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Create Your Password
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-gray-400 mb-4">
                  Create a password for your account: {email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-gray-300">Password Requirements:</h3>
                <RequirementItem met={requirements.length} text="At least 8 characters" />
                <RequirementItem met={requirements.uppercase} text="At least one uppercase letter" />
                <RequirementItem met={requirements.lowercase} text="At least one lowercase letter" />
                <RequirementItem met={requirements.number} text="At least one number" />
                <RequirementItem met={requirements.special} text="At least one special character (!@#$%^&*)" />
                <RequirementItem met={requirements.match} text="Passwords match" />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 
                  ${isSubmitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-600 animate-shimmer bg-[length:200%_100%]'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PasswordCreationModal;
