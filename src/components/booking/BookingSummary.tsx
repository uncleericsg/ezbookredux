import React, { FC } from 'react';
import { format } from 'date-fns';
import { 
  HiOutlineClipboardDocument,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList
} from 'react-icons/hi2';
import type { BookingDetails } from '@shared/types/booking';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatters';
import { toPascalCase } from '@/utils/strings';
import { formatTimeSlot } from '@/utils/dates';

export interface BookingSummaryProps {
  booking?: BookingDetails;
  className?: string;
}

export const BookingSummary: FC<BookingSummaryProps> = ({
  booking,
  className
}) => {
  if (!booking) return null;

  return (
    <div className={cn("bg-gray-800/90 rounded-lg shadow-sm p-6 max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
          <HiOutlineClipboardDocument className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          Booking Summary
        </h2>
      </div>

      {/* Service Details - Single Column */}
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">{booking.service_title}</h3>
        {booking.service_description && (
          <p className="text-sm text-gray-400 mb-3 max-w-lg mx-auto">{booking.service_description}</p>
        )}
        <div className="flex flex-col items-center gap-1">
          <p className="text-yellow-400 text-xl font-semibold">{formatPrice(booking.service_price)}</p>
          <div className="flex items-center text-gray-400 text-sm">
            <HiOutlineClock className="w-4 h-4 mr-1" />
            <span>{booking.service_duration}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-4">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-400 mb-1">
              <HiOutlineUser className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Customer Information</span>
            </div>
            <div>
              <p className="text-base font-medium text-white">
                {toPascalCase(booking.customer_info.first_name)} {toPascalCase(booking.customer_info.last_name)}
              </p>
              <p className="text-sm text-gray-300">{booking.customer_info.mobile}</p>
              <p className="text-sm text-gray-300 mt-1">
                {booking.customer_info.block_street}
                {booking.customer_info.floor_unit && `, #${booking.customer_info.floor_unit}`}
                {booking.customer_info.postal_code && `, Singapore ${booking.customer_info.postal_code}`}
              </p>
              {booking.customer_info.condo_name && (
                <p className="text-sm text-gray-300">
                  Condo: {toPascalCase(booking.customer_info.condo_name)}
                </p>
              )}
              {booking.customer_info.lobby_tower && (
                <p className="text-sm text-gray-300">
                  Lobby/Tower: {toPascalCase(booking.customer_info.lobby_tower)}
                </p>
              )}
            </div>
          </div>

          {/* Selected Time Slot */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-400 mb-1">
              <HiOutlineCalendarDays className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Selected Time Slot</span>
            </div>
            <div>
              <p className="text-base font-medium text-white">
                {format(new Date(booking.scheduled_datetime), 'PPP')}
              </p>
              <p className="text-gray-400 text-base">
                {formatTimeSlot(booking.scheduled_timeslot, booking.service_duration)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:border-l md:border-gray-700/50 md:pl-12">
          {/* AC Brands */}
          {booking.brands && booking.brands.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineWrenchScrewdriver className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">AC Brands</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.brands.map((brand, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-700/50 rounded text-sm text-gray-300"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reported Issues */}
          {booking.issues && booking.issues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineClipboardDocumentList className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Reported Issues</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                {booking.issues.map((issue, index) => (
                  <div key={index}>{issue}</div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {booking.other_issue && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineClipboardDocumentList className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Additional Notes</span>
              </div>
              <div className="text-sm text-gray-300">
                {booking.other_issue}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BookingSummary.displayName = 'BookingSummary';

export default BookingSummary;
