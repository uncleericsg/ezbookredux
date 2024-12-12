import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RatingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RatingConfirmationModal: React.FC<RatingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    navigate('/');
  };

  const handleCancel = () => {
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Share Your Experience</h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-300 mb-6">
            Thank you for your feedback! Would you like to share your experience on Google to help others find our service?
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Maybe Later
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Rate on Google</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RatingConfirmationModal;