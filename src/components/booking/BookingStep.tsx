import React from 'react';
import { toast } from 'sonner';
import type { BookingDetails, CreateBookingParams } from '@shared/types/booking';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import { BookingList } from './BookingList';
import { BookingSummary } from './BookingSummary';

interface BookingStepProps {
  onNext: () => void;
  onBack: () => void;
  bookingData: Partial<CreateBookingParams>;
  className?: string;
}

const BookingStep: React.FC<BookingStepProps> = ({
  onNext,
  onBack,
  bookingData,
  className
}) => {
  const { loading, error, createBooking } = useBooking();
  const { user } = useAuth();

  const handleCreateBooking = async () => {
    if (!user?.email) {
      toast.error('Please sign in to create a booking');
      return;
    }

    if (!bookingData.service_title || !bookingData.service_price || !bookingData.scheduled_datetime) {
      toast.error('Missing required booking information');
      return;
    }

    try {
      const result = await createBooking({
        ...bookingData,
        customer_email: user.email,
        status: 'pending'
      } as CreateBookingParams);

      if (result.data) {
        toast.success('Booking created successfully');
        onNext();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Booking Summary */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Booking Summary
          </h2>
          <BookingSummary booking={bookingData as BookingDetails} />
        </div>

        {/* Recent Bookings */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Bookings
          </h2>
          <BookingList limit={3} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleCreateBooking}
            disabled={loading}
            className={`px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-center mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

BookingStep.displayName = 'BookingStep';

export default BookingStep; 