import React from 'react';
import { X, Loader2 } from 'lucide-react';
import type { AMCPackage } from '@types';

interface AMCRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: AMCPackage;
  onSuccess: () => void;
  loading?: boolean;
}

const AMCRenewalModal: React.FC<AMCRenewalModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  onSuccess,
  loading,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to renew AMC:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Renew AMC Package</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">{selectedPackage.name}</h3>
          <p className="text-gray-400 mb-4">
            {selectedPackage.visits} service visits included
          </p>
          <div className="text-2xl font-bold mb-4">
            ${selectedPackage.price}
            <span className="text-gray-400 text-base font-normal">/year</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            'Confirm Renewal'
          )}
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          Your subscription will be activated immediately after confirmation
        </p>
      </div>
    </div>
  );
};

export default AMCRenewalModal;