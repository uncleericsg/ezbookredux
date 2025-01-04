import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExistingUserModalProps } from '../types';

const ExistingUserModal: React.FC<ExistingUserModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userMobile,
  type
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg p-6 bg-gray-900 rounded-xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent mb-4">
              Existing User Found
            </h2>
            <div className="text-gray-300 mb-6">
              {type === 'email' ? (
                <>
                  An account already exists with the email address{' '}
                  <span className="text-blue-400">{userEmail}</span>. Please log in to continue.
                </>
              ) : (
                <>
                  An account already exists with the mobile number{' '}
                  <span className="text-blue-400">{userMobile}</span>. Please log in to continue.
                </>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  // TODO: Implement login redirect
                  // navigate('/auth/login');
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black font-semibold rounded-lg
                         hover:opacity-90 transition-opacity"
              >
                Log In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExistingUserModal;