import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList
} from 'react-icons/hi2';
import type { BookingDetails } from '@shared/types/booking';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/formatters';
import { formatTimeSlot } from '@/utils/dates';

interface BookingListProps {
  className?: string;
  limit?: number;
}

const BookingList: React.FC<BookingListProps> = ({ className, limit }) => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const { loading, error, fetchBookingsByEmail } = useBooking();
  const { user } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.email) return;

      try {
        const result = await fetchBookingsByEmail(user.email);
        if (result.data) {
          setBookings(limit ? result.data.slice(0, limit) : result.data);
        } else if (result.error) {
          toast.error('Failed to load bookings');
        }
      } catch (err) {
        toast.error('Error loading bookings');
      }
    };

    loadBookings();
  }, [user?.email, fetchBookingsByEmail, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-8">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No bookings found
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-800/90 rounded-lg shadow-sm p-6"
          >
            {/* Service Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                {booking.service_title}
              </h3>
              <p className="text-yellow-400 font-medium">
                {formatPrice(booking.service_price)}
              </p>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Date and Time */}
                <div className="flex items-start space-x-3">
                  <HiOutlineCalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-white">
                      {format(new Date(booking.scheduled_datetime), 'PPP')}
                    </p>
                    <p className="text-gray-400">
                      {formatTimeSlot(booking.scheduled_timeslot, booking.service_duration)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
                  <HiOutlineClock className="w-5 h-5 text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'completed' 
                      ? 'bg-green-900 text-green-200'
                      : booking.status === 'pending'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Brands */}
                {booking.brands && booking.brands.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <HiOutlineWrenchScrewdriver className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {booking.brands.map((brand, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700/50 rounded text-sm text-gray-300"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {booking.issues && booking.issues.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <HiOutlineClipboardDocumentList className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-300 space-y-1">
                      {booking.issues.map((issue, index) => (
                        <div key={index}>{issue}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

BookingList.displayName = 'BookingList';

export default BookingList; 