import { useMemo, useCallback } from 'react';
import { format, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { TimeSlot } from '@shared/types/booking';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSelectSlot: (slot: TimeSlot) => void;
  isAMC?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isAMC = false
}) => {
  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    onSelectSlot(slot);
  }, [onSelectSlot]);

  const formattedSlots = useMemo(() => {
    return slots.map(slot => ({
      ...slot,
      formattedTime: format(new Date(slot.startTime), 'h:mm a')
    }));
  }, [slots]);

  if (!slots.length) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-gray-500">No available time slots</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      {formattedSlots.map((slot) => (
        <motion.button
          key={slot.id}
          onClick={() => handleSlotSelect(slot)}
          className={`rounded-lg border p-4 text-center transition-colors ${
            selectedSlot?.id === slot.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 hover:border-primary/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="block font-medium">{slot.formattedTime}</span>
        </motion.button>
      ))}
    </div>
  );
};