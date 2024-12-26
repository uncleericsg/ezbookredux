import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import React from 'react';

interface FloatingSaveButtonProps {
  onClick: () => void;
  loading?: boolean;
  visible: boolean;
}

const FloatingSaveButton: React.FC<FloatingSaveButtonProps> = ({
  onClick,
  loading,
  visible
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          disabled={loading}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors flex items-center space-x-2 z-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingSaveButton;