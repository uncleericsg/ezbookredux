import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import PasswordCreationModal from '@components/auth/PasswordCreationModal';
import { ROUTES } from '@config/routes';
import { toast } from 'sonner';
import { logger } from '@/server/utils/logger';

interface BookingConfirmationProps {
  onCreateAccount?: (password: string) => Promise<boolean>;
  sessionId?: string;
  onDownloadReceipt?: () => void;
  email?: string;
}

interface SessionStatus {
  status: string;
  metadata: {
    bookingId: string;
    amount: string;
    currency: string;
    service: string;
    date: string;
  };
  receiptUrl?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  onCreateAccount,
  sessionId,
  onDownloadReceipt,
  email: propEmail,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sessionData, setSessionData] = useState<SessionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentUser } = useAppSelector((state) => state.user);
  const email = propEmail || currentUser?.email;

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        if (!sessionId) return;
        
        const response = await fetch(`/api/payments/status?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session status');
        }
        
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        logger.error('Failed to fetch session status', { error });
        toast.error('Failed to load payment details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

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

  const handleDownload = () => {
    if (!sessionData?.receiptUrl) {
      toast.error('Receipt not available yet');
      return;
    }
    
    // Open receipt in new tab (Stripe hosted receipt)
    window.open(sessionData.receiptUrl, '_blank');
    onDownloadReceipt?.();
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center"
      >
        <p>Loading payment details...</p>
      </motion.div>
    );
  }

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

      {sessionData && (
        <div className="space-y-6 mb-8">
          <div className="flex items-start space-x-4">
            <Calendar className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Appointment Details</p>
              <p className="text-gray-600">{sessionData.metadata.service}</p>
              <p className="text-gray-600">{sessionData.metadata.date}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CreditCard className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Payment Details</p>
              <p className="text-gray-600">Amount: ${parseInt(sessionData.metadata.amount) / 100}</p>
              <p className="text-gray-600">Status: {sessionData.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sessionData?.receiptUrl && (
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Receipt
          </button>
        )}

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
