import React from 'react';
import type { TimeSlotPickerProps } from '@/types/schedule';
import { formatTime } from '@/utils/dates';

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  className,
  disabled
}) => {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelectSlot(slot)}
          disabled={disabled || (slot.isAvailable === false)}
          className={`
            p-3 rounded-lg text-center transition-colors
            ${
              selectedSlot?.id === slot.id
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }
            ${disabled || (slot.isAvailable === false) ? 'opacity-50 cursor-not-allowed' : ''}
            ${slot.isPeakHour ? 'border-2 border-yellow-500' : ''}
          `}
        >
          <div className="font-medium">
            {formatTime(slot.startTime)}
            {slot.endTime && ` - ${formatTime(slot.endTime)}`}
          </div>
          {slot.isPeakHour && (
            <div className="text-xs mt-1 text-yellow-500">
              Peak Hour
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

TimeSlotPicker.displayName = 'TimeSlotPicker';