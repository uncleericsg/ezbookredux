import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit2 } from 'lucide-react';

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  address: {
    blockStreet: string;
    postalCode: string;
    condoName?: string;
  };
}

export const AddressConfirmationModal: React.FC<AddressConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  address
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white">Confirm Address</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-white font-medium">{address.blockStreet}</p>
              <p className="text-gray-400">Singapore {address.postalCode}</p>
              {address.condoName && (
                <p className="text-gray-400 mt-1">{address.condoName}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
