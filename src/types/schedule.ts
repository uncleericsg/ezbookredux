/**
 * Simple time slot type for the picker
 */
export interface PickerTimeSlot {
  id: string;
  startTime: string;
  endTime?: string;
  isAvailable?: boolean;
  isPeakHour?: boolean;
}

/**
 * Calendar date type
 */
export type CalendarDate = Date | null;

/**
 * Calendar props type
 */
export interface CalendarProps {
  mode: 'single';
  selected: CalendarDate;
  onSelect: (date: CalendarDate) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

/**
 * Time slot picker props type
 */
export interface TimeSlotPickerProps {
  slots: PickerTimeSlot[];
  selectedSlot?: PickerTimeSlot;
  onSelectSlot: (slot: PickerTimeSlot) => void;
  className?: string;
  disabled?: boolean;
}