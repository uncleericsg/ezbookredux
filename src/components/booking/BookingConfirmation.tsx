import React from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiOutlineCalendar, HiOutlineUser, HiOutlineHome } from 'react-icons/hi2';
import { cn } from '@/utils/cn';
import type { BookingData } from '@/types/booking-flow';
import { format, isValid } from 'date-fns';
import { formatPrice } from '@/utils/formatters';

const formatBookingDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return isValid(date) ? format(date, 'PPP') : 'Invalid date';
};

interface BookingConfirmationProps {
  booking: BookingData;
  onViewBookings: () => void;
  className?: string;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onViewBookings,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col items-center justify-center space-y-6 rounded-lg bg-white p-8 text-center shadow-sm',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <HiCheckCircle className="h-16 w-16 text-green-500" />
      </motion.div>

      <h2 className="text-2xl font-semibold text-gray-900">
        Booking Confirmed!
      </h2>

      <p className="max-w-sm text-gray-600">
        Your booking has been confirmed. We've sent a confirmation email with all the details.
      </p>

      {/* Booking Details */}
      <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-50 p-6">
        {/* Service Details */}
        <div className="flex items-start space-x-3">
          <HiOutlineCalendar className="mt-0.5 h-5 w-5 text-gray-500" />
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900">{booking.serviceTitle}</p>
            <p className="text-sm text-gray-600">
              {formatBookingDate(booking.date)} at {booking.time || 'Not specified'}
            </p>
            <p className="text-sm font-medium text-blue-600">
              {formatPrice(booking.servicePrice)}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="flex items-start space-x-3">
          <HiOutlineUser className="mt-0.5 h-5 w-5 text-gray-500" />
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900">
              {booking.customerInfo.firstName} {booking.customerInfo.lastName}
            </p>
            <p className="text-sm text-gray-600">{booking.customerInfo.email}</p>
            <p className="text-sm text-gray-600">{booking.customerInfo.phone}</p>
          </div>
        </div>

        {/* Address Details */}
        <div className="flex items-start space-x-3">
          <HiOutlineHome className="mt-0.5 h-5 w-5 text-gray-500" />
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900">Service Address</p>
            <p className="text-sm text-gray-600">
              {booking.customerInfo.address.blockStreet}
              {booking.customerInfo.address.floorUnit && `, Unit ${booking.customerInfo.address.floorUnit}`}
              {booking.customerInfo.address.condoName && `, ${booking.customerInfo.address.condoName}`}
            </p>
            <p className="text-sm text-gray-600">
              Singapore {booking.customerInfo.address.postalCode}
              {booking.customerInfo.address.region && ` (${booking.customerInfo.address.region})`}
            </p>
          </div>
        </div>

        {/* Additional Details */}
        {(booking.brands.length > 0 || booking.issues.length > 0) && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            {booking.brands.length > 0 && (
              <div className="mb-2">
                <p className="font-medium text-gray-900">Brands</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {booking.issues.length > 0 && (
              <div>
                <p className="font-medium text-gray-900">Issues</p>
                <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                  {booking.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onViewBookings}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
      >
        View My Bookings
      </button>
    </motion.div>
  );
};
