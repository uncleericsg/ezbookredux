import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700"
        >
          <div className="flex items-start space-x-3 mb-6">
            <AlertTriangle className={`h-6 w-6 ${isDestructive ? 'text-red-400' : 'text-yellow-400'}`} />
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-gray-400 mt-1">{message}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="btn btn-secondary min-w-[100px]"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`btn min-w-[100px] ${
                isDestructive ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;