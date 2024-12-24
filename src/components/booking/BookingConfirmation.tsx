import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import PasswordCreationModal from '../auth/PasswordCreationModal';
import { ROUTES } from '../../config/routes';
import { getPaymentReceipt } from '../../services/paymentService';
import { toast } from 'react-hot-toast';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  paymentMethod: string;
  address: string;
  paymentIntentId: string;
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

  const handleViewBookings = () => {
    // Navigate to profile page with bookings tab active
    navigate(ROUTES.PROFILE, {
      state: { activeTab: 'bookings' }
    });
  };

  if (!booking || !bookingReference) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl text-white text-center mb-4">Booking Information Not Found</h2>
          <p className="text-gray-400 text-center mb-6">
            We couldn't find the booking details. This could be because:
            <ul className="list-disc list-inside mt-2">
              <li>The booking reference is invalid</li>
              <li>The payment process was interrupted</li>
              <li>You're not logged in to view this booking</li>
            </ul>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(ROUTES.BOOKING.SERVICE)}
              className="py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              New Booking
            </button>
            <button
              onClick={handleViewBookings}
              className="py-2 px-4 bg-[#FFD700] text-gray-900 rounded-md hover:bg-[#FFD700]/90 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        </div>
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

  const handleDownload = async () => {
    try {
      if (onDownloadReceipt) {
        onDownloadReceipt();
        return;
      }

      if (!booking.paymentIntentId) {
        toast.error('Payment information not found');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Generating receipt...');

      try {
        // Make GET request to generate receipt
        const response = await fetch(`/api/payments/${booking.paymentIntentId}/generate-receipt`);
        
        if (!response.ok) {
          throw new Error('Failed to generate receipt');
        }

        // Get the blob from response
        const blob = await response.blob();
        
        // Create object URL
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and click it
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${booking.paymentIntentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Show success toast
        toast.success('Receipt downloaded successfully');
      } catch (error) {
        console.error('Error downloading receipt:', error);
        toast.error('Failed to download receipt. Please try again later.');
      } finally {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      toast.error('Failed to process download request');
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-8 bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50"
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
              onClick={handleViewBookings}
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
    </div>
  );
};

BookingConfirmation.displayName = 'BookingConfirmation';

export { BookingConfirmation };
export default BookingConfirmation;
