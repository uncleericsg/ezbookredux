import type { FC } from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GuestNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuestNotificationModal: FC<GuestNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBookNow = () => {
    navigate('/booking/prices');
    onClose();
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
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Service Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-300 mb-6">
            Book a service now to receive service notifications and stay updated on your maintenance schedule.
          </p>

          <button
            onClick={handleBookNow}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <span>Book a Service</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GuestNotificationModal;