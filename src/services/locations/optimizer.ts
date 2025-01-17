import { parseISO } from 'date-fns';
import type { TimeSlot } from '@/types/timeSlot';
import type { RegionKey } from './classifier';

export function optimizeTimeSlots(slots: TimeSlot[], region: RegionKey): TimeSlot[] {
  // Sort slots by start time
  const sortedSlots = [...slots].sort((a, b) => {
    const timeA = parseISO(a.startTime).getTime();
    const timeB = parseISO(b.startTime).getTime();
    return timeA - timeB;
  });

  // Filter out unavailable slots
  const availableSlots = sortedSlots.filter(slot => slot.isAvailable);

  // Group slots by time of day
  const morningSlots = availableSlots.filter(slot => {
    const hour = parseISO(slot.startTime).getHours();
    return hour >= 9 && hour < 12;
  });

  const afternoonSlots = availableSlots.filter(slot => {
    const hour = parseISO(slot.startTime).getHours();
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = availableSlots.filter(slot => {
    const hour = parseISO(slot.startTime).getHours();
    return hour >= 17 && hour < 21;
  });

  // Prioritize slots based on region and time of day
  const prioritizedSlots = [];

  switch (region) {
    case 'CENTRAL':
      // Central region prefers morning and evening slots
      prioritizedSlots.push(...morningSlots, ...eveningSlots, ...afternoonSlots);
      break;
    case 'EAST':
    case 'WEST':
      // East and West regions prefer afternoon slots
      prioritizedSlots.push(...afternoonSlots, ...morningSlots, ...eveningSlots);
      break;
    case 'NORTH':
    case 'SOUTH':
      // North and South regions have no specific preference
      prioritizedSlots.push(...availableSlots);
      break;
    default:
      prioritizedSlots.push(...availableSlots);
  }

  // Mark optimized slots
  return prioritizedSlots.map(slot => ({
    ...slot,
    optimized: true
  }));
}