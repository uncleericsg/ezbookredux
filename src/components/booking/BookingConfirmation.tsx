import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import PasswordCreationModal from '@components/auth/PasswordCreationModal';
import { ROUTES } from '@config/routes';
import { getPaymentReceipt } from '@services/paymentService';
import { toast } from 'sonner';
import type { PaymentDetails, PaymentIntentResponse } from '@shared/types/payment';
import { logger } from '@/utils/logger';

interface BookingConfirmationProps {
  onCreateAccount?: (password: string) => Promise<boolean>;
  paymentIntent?: PaymentIntentResponse;
  onDownloadReceipt?: () => void;
  email?: string;
  booking?: PaymentDetails;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  onCreateAccount,
  paymentIntent,
  onDownloadReceipt,
  email: propEmail,
  booking: propBooking
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { currentUser } = useAppSelector((state) => state.user);
  const email = propEmail || currentUser?.email;

  const handleViewBookings = () => {
    if (!currentUser) {
      setShowPasswordModal(true);
      return;
    }
    navigate(ROUTES.BOOKINGS);
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      if (onCreateAccount) {
        const success = await onCreateAccount(password);
        if (success) {
          setShowPasswordModal(false);
          navigate(ROUTES.BOOKINGS);
          return;
        }
      }
      throw new Error('Account creation failed');
    } catch (error) {
      logger.error('Failed to create account', { error });
      toast.error('Failed to create account. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      if (!paymentIntent?.paymentIntentId) {
        throw new Error('No payment reference found');
      }

      const response = await getPaymentReceipt(paymentIntent.paymentIntentId);
      
      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentIntent.paymentIntentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onDownloadReceipt?.();
    } catch (error) {
      logger.error('Failed to download receipt', { error });
      toast.error('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          {email && `We've sent a confirmation email to ${email}`}
        </p>
      </div>

      {propBooking && (
        <div className="space-y-6 mb-8">
          <div className="flex items-start space-x-4">
            <Calendar className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Appointment Details</p>
              <p className="text-gray-600">{propBooking.service_id}</p>
              <p className="text-gray-600">{new Date(propBooking.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CreditCard className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Payment Details</p>
              <p className="text-gray-600">Amount: ${propBooking.amount}</p>
              <p className="text-gray-600">Status: {propBooking.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isDownloading ? 'Downloading...' : 'Download Receipt'}
        </button>

        <button
          onClick={handleViewBookings}
          className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          View All Bookings
        </button>
      </div>

      {showPasswordModal && (
        <PasswordCreationModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
          email={email}
        />
      )}
    </motion.div>
  );
};

export default BookingConfirmation;
