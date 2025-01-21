import { format } from 'date-fns';

/**
 * Format a time slot for display
 * @param timeSlot Time slot in HH:mm format
 * @param duration Duration in minutes (optional)
 * @returns Formatted time slot string
 */
export function formatTimeSlot(timeSlot: string, duration?: number): string {
  const startTime = new Date(`2000-01-01T${timeSlot}`);
  if (!duration) {
    return format(startTime, 'h:mm a');
  }

  const endTime = new Date(startTime.getTime() + duration * 60000);
  return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
}

/**
 * Format a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'PPP');
}

/**
 * Format a time for display
 * @param time Time in HH:mm format
 * @returns Formatted time string
 */
export function formatTime(time: string): string {
  const date = new Date(`2000-01-01T${time}`);
  return format(date, 'h:mm a');
}
