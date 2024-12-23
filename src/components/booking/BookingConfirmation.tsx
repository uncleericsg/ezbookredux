import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import PasswordCreationModal from '../auth/PasswordCreationModal';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  paymentMethod: string;
  address: string;
}

interface BookingConfirmationProps {
  onCreateAccount?: (password: string) => Promise<boolean>;
  bookingReference?: string;
  onDownloadReceipt?: () => void;
  email?: string;
  booking?: Booking;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  onCreateAccount,
  bookingReference: propBookingReference,
  onDownloadReceipt,
  email: propEmail,
  booking: propBooking
}) => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Get booking details either from props, location state, or user's bookings
  const booking = propBooking || location.state?.booking || currentUser?.bookings?.find(b => b.id === bookingId);
  const bookingReference = propBookingReference || booking?.id;
  const email = propEmail || currentUser?.email;

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-xl text-white text-center mb-4">Booking not found</h2>
        <button
          onClick={() => navigate('/profile')}
          className="w-full py-2 px-4 bg-[#FFD700] text-gray-900 rounded-md hover:bg-[#FFD700]/90 transition-colors"
        >
          View All Bookings
        </button>
      </div>
    );
  }

  const handlePasswordSubmit = async (password: string) => {
    try {
      if (onCreateAccount) {
        const success = await onCreateAccount(password);
        if (success) {
          setIsModalOpen(false);
          navigate('/profile', { replace: true });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error creating account:', error);
      return false;
    }
  };

  const handleDownload = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      // Implement default receipt download logic here
      console.log('Downloading receipt for booking:', bookingReference);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-8 space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-[#FFD700]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Booking Details</h2>
            <p className="text-gray-400">
              {booking.status === 'Upcoming' ? 'Your service has been scheduled.' : `Booking Status: ${booking.status}`}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FFD700]" />
                <span className="text-gray-400">Service Date</span>
              </div>
              <span className="text-white">{booking.date} at {booking.time}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-[#FFD700]" />
                <span className="text-gray-400">Payment Method</span>
              </div>
              <span className="text-white">{booking.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-white">${booking.amount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Service Address</span>
              <span className="text-white">{booking.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Booking Reference</span>
              <span className="text-white">{bookingReference}</span>
            </div>

            {email && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{email}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleDownload}
              className="w-full py-2 px-4 bg-[#FFD700] text-gray-900 rounded-md hover:bg-[#FFD700]/90 transition-colors"
            >
              Download Receipt
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </motion.div>

      {/* Password Creation Modal */}
      {!currentUser && onCreateAccount && (
        <PasswordCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </>
  );
};

BookingConfirmation.displayName = 'BookingConfirmation';

export { BookingConfirmation };
export default BookingConfirmation;
