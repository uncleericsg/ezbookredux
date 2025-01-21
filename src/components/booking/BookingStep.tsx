import React from 'react';
import { toast } from 'sonner';
import type { BookingData, BaseStepProps } from '../../types/booking-flow';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import BookingList from './BookingList';
import { BookingSummary } from './BookingSummary';

const BookingStep: React.FC<BaseStepProps> = ({
  onNext,
  onBack,
  bookingData,
  onUpdateBookingData,
  className
}) => {
  const { loading, error, createBooking } = useBooking();
  const { user } = useAuth();

  const handleCreateBooking = async () => {
    if (!user?.email) {
      toast.error('Please sign in to create a booking');
      return;
    }

    if (!bookingData.serviceTitle || !bookingData.servicePrice || !bookingData.date) {
      toast.error('Missing required booking information');
      return;
    }

    try {
      const result = await createBooking({
        ...bookingData,
        customerInfo: {
          ...bookingData.customerInfo,
          id: user.id
        }
      });

      if (result.data) {
        toast.success('Booking created successfully');
        onNext();
      } else if (result.error) {
        toast.error(result.error.message);
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
          <BookingSummary
            data={{
              service_title: bookingData.serviceTitle,
              service_price: bookingData.servicePrice,
              service_duration: String(bookingData.serviceDuration),
              customer_info: {
                first_name: bookingData.customerInfo.firstName,
                last_name: bookingData.customerInfo.lastName,
                email: bookingData.customerInfo.email,
                mobile: bookingData.customerInfo.phone,
                floor_unit: bookingData.customerInfo.address.floorUnit || '',
                block_street: bookingData.customerInfo.address.blockStreet,
                postal_code: bookingData.customerInfo.address.postalCode,
                condo_name: bookingData.customerInfo.address.condoName || undefined,
                lobby_tower: bookingData.customerInfo.address.lobbyTower || undefined,
                special_instructions: bookingData.customerInfo.specialInstructions || undefined
              },
              scheduled_datetime: new Date(bookingData.date),
              scheduled_timeslot: bookingData.time,
              total_amount: bookingData.servicePrice,
              tip_amount: 0 // Added required field
            }}
          />
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
