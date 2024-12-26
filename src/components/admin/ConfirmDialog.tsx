import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className={`h-6 w-6 ${isDestructive ? 'text-red-400' : 'text-yellow-400'}`} />
                <div>
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-gray-300">{message}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;