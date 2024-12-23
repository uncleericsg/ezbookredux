import { FC } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/constants/serviceConfig';
import { format, addMinutes, addHours, parse } from 'date-fns';
import { 
  HiOutlineClipboardDocument,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineWrenchScrewdriver,
  HiOutlineClock
} from 'react-icons/hi2';
import { toPascalCase } from '../../utils/stringUtils';

const formatTimeSlot = (timeSlot: string, duration: string): string => {
  try {
    // Parse duration into minutes
    let totalMinutes = 0;
    
    // Handle complex duration formats (e.g., "1 hour 30 mins")
    const durationStr = duration.toLowerCase();
    const hours = durationStr.match(/(\d+)\s*(?:hour|hr|h)/);
    const minutes = durationStr.match(/(\d+)\s*(?:minute|min|m)/);
    
    if (hours) {
      totalMinutes += parseInt(hours[1]) * 60;
    }
    if (minutes) {
      totalMinutes += parseInt(minutes[1]);
    }

    // If no duration found, try parsing the whole string as minutes
    if (totalMinutes === 0) {
      const numericDuration = parseInt(duration);
      if (!isNaN(numericDuration)) {
        totalMinutes = numericDuration;
      }
    }

    if (totalMinutes === 0) {
      console.error('Could not parse duration:', duration);
      return timeSlot;
    }

    // Parse start time
    let startTime: Date;
    const timeStr = timeSlot.trim();
    const is24Hour = timeStr.includes(':') && !timeStr.toLowerCase().includes('m');
    
    if (is24Hour) {
      // Handle 24-hour format (e.g., "14:00")
      startTime = parse(timeStr, 'HH:mm', new Date());
    } else {
      // Handle 12-hour format (e.g., "2:00 PM")
      const normalizedTime = timeStr.toUpperCase().replace('.', '');
      startTime = parse(normalizedTime, 'h:mm a', new Date());
    }

    // Calculate end time
    const endTime = addMinutes(startTime, totalMinutes);

    // Format times
    const formatStr = 'h:mma';
    const start = format(startTime, formatStr).replace(':00', '').replace(/\s/g, '');
    const end = format(endTime, formatStr).replace(':00', '').replace(/\s/g, '');

    return `${start} to ${end}`;
  } catch (error) {
    console.error('Error formatting time slot:', error);
    return timeSlot; // Return original if parsing fails
  }
};

export interface BookingSummaryProps {
  service?: {
    id: string;
    title: string;
    price: number;
    duration: string;
    description?: string;
  };
  brands?: string[];
  issues?: string[];
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    floorUnit: string;
    blockStreet: string;
    postalCode: string;
    otherIssue?: string;
    condoName?: string;
    buildingName?: string;
    lobbyTower?: string;
  } | null;
  selectedDate?: Date;
  selectedTimeSlot?: string;
  className?: string;
}

export const BookingSummary: FC<BookingSummaryProps> = ({
  service,
  brands,
  issues,
  customerInfo,
  selectedDate,
  selectedTimeSlot,
  className
}) => {
  console.log('BookingSummary - Received props:', {
    service,
    brands,
    issues,
    customerInfo,
    selectedDate,
    selectedTimeSlot
  });

  if (!service) return null;

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
        <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
        {service.description && (
          <p className="text-sm text-gray-400 mb-3 max-w-lg mx-auto">{service.description}</p>
        )}
        <div className="flex flex-col items-center gap-1">
          <p className="text-yellow-400 text-xl font-semibold">{formatPrice(service.price)}</p>
          <div className="flex items-center text-gray-400 text-sm">
            <HiOutlineClock className="w-4 h-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-4">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          {customerInfo && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineUser className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Customer Information</span>
              </div>
              <div>
                <p className="text-base font-medium text-white">
                  {toPascalCase(customerInfo.firstName)} {toPascalCase(customerInfo.lastName)}
                </p>
                <p className="text-sm text-gray-300">{customerInfo.mobile}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {customerInfo.blockStreet || customerInfo.address}
                  {(customerInfo.floorUnit || customerInfo.unit) && 
                    `, #${customerInfo.floorUnit || customerInfo.unit}`}
                  {customerInfo.postalCode && `, Singapore ${customerInfo.postalCode}`}
                </p>
                {(customerInfo.condoName || customerInfo.buildingName) && (
                  <p className="text-sm text-gray-300">
                    Condo: {toPascalCase(customerInfo.condoName || customerInfo.buildingName)}
                  </p>
                )}
                {customerInfo.lobbyTower && (
                  <p className="text-sm text-gray-300">
                    Lobby/Tower: {toPascalCase(customerInfo.lobbyTower)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Selected Time Slot */}
          {selectedDate && selectedTimeSlot && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineCalendarDays className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Selected Time Slot</span>
              </div>
              <div>
                <p className="text-base font-medium text-white">{format(selectedDate, 'PPP')}</p>
                <p className="text-gray-400 text-base">
                  {service?.duration ? formatTimeSlot(selectedTimeSlot, service.duration) : selectedTimeSlot}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:border-l md:border-gray-700/50 md:pl-12">
          {/* AC Brands */}
          {brands && brands.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineWrenchScrewdriver className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">AC Brands</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand, index) => (
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
          {issues && issues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineClipboardDocumentList className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Reported Issues</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                {issues.map((issue, index) => (
                  <div key={index}>{issue}</div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {customerInfo?.otherIssue && (
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 mb-1">
                <HiOutlineClipboardDocumentList className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Additional Notes</span>
              </div>
              <div className="text-sm text-gray-300">
                {customerInfo.otherIssue}
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
