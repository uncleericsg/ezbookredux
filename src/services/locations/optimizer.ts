import { addMinutes } from 'date-fns';
import { REGION_PRIORITY, REGION_CENTERS, type Region } from './regions';
import type { TimeSlot } from '../../types';
import { validateBookingTime } from '../../utils/validation';
import { BUSINESS_RULES } from '../../constants';

const BUFFER_MINUTES = 60;
const NEARBY_BOOKING_PENALTY = 0.5;
const MAX_OVERLAPPING_SLOTS = 2;
const MAX_SLOTS_PER_REGION = 3;
const PEAK_HOUR_PENALTY = 0.8;

export interface NearbyBooking {
  datetime: string;
  location: string;
  region: Region;
  duration: number;
}

export const fetchNearbyBookings = async (address: string): Promise<NearbyBooking[]> => {
  // Local implementation that returns mock data
  const mockBookings: NearbyBooking[] = [];
  const today = new Date();
  const regions = Object.keys(REGION_CENTERS) as Region[];

  // Generate some mock bookings for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Add 2-3 bookings per day
    const bookingsForDay = Math.floor(Math.random() * 2) + 2;
    
    for (let j = 0; j < bookingsForDay; j++) {
      const hour = Math.floor(Math.random() * (17 - 9)) + 9; // Between 9 AM and 5 PM
      date.setHours(hour, 0, 0, 0);
      
      mockBookings.push({
        datetime: date.toISOString(),
        location: address,
        region: regions[Math.floor(Math.random() * regions.length)],
        duration: Math.random() > 0.3 ? 90 : 60 // Mix of AMC and regular bookings
      });
    }
  }

  return mockBookings;
};

export const optimizeTimeSlots = (
  date: Date,
  slots: TimeSlot[],
  region: Region,
  existingBookings: Array<{ datetime: string; region: Region; duration: number }> = [],
  options: {
    holidays?: Set<string>;
    isAMC?: boolean;
    maxSlotsPerRegion?: number;
  } = {}
): TimeSlot[] => {
  const {
    holidays = new Set(),
    isAMC = false,
    maxSlotsPerRegion = MAX_SLOTS_PER_REGION
  } = options;

  // Early return for empty slots
  if (!slots.length) return [];

  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];
  const dateStr = date.toISOString().split('T')[0];
  if (holidays.has(dateStr)) return [];
  
  const regionPriority = REGION_PRIORITY[dayOfWeek];
  if (!regionPriority) return slots;

  const regionIndex = regionPriority.indexOf(region);
  const regionWeight = regionPriority.length - regionIndex;

  // Track slots per region
  const slotsPerRegion = new Map<Region, number>();

  // Filter and validate slots with business rules
  const validSlots = slots.filter(slot => {
    const slotTime = new Date(slot.datetime);
    
    // Validate against business rules
    const validation = validateBookingTime(slot.datetime, isAMC);
    if (!validation.isValid) return false;

    // Check overlapping slots
    const overlappingCount = getOverlappingBookings(slot, existingBookings);
    if (overlappingCount >= MAX_OVERLAPPING_SLOTS) return false;

    // Check region capacity
    const slotRegion = region;
    const currentCount = slotsPerRegion.get(slotRegion) || 0;
    if (currentCount >= maxSlotsPerRegion) return false;
    slotsPerRegion.set(slotRegion, currentCount + 1);

    return true;
  });

  // Enhanced slot scoring and sorting
  return validSlots.sort((a, b) => {
    const timeA = new Date(a.datetime).getHours();
    const timeB = new Date(b.datetime).getHours();
    
    // Calculate time-based weights
    const morningWeightA = timeA >= BUSINESS_RULES.BUSINESS_START_HOUR.START && timeA <= 12 ? 2 : 1;
    const morningWeightB = timeB >= BUSINESS_RULES.BUSINESS_START_HOUR.START && timeA <= 12 ? 2 : 1;
    
    // Peak hour penalties
    const peakPenaltyA = timeA >= BUSINESS_RULES.PEAK_HOURS.START && timeA <= BUSINESS_RULES.PEAK_HOURS.END ? PEAK_HOUR_PENALTY : 0;
    const peakPenaltyB = timeB >= BUSINESS_RULES.PEAK_HOURS.START && timeB <= BUSINESS_RULES.PEAK_HOURS.END ? PEAK_HOUR_PENALTY : 0;
    
    // Calculate overlapping and region weights
    const overlappingA = getOverlappingBookings(a, existingBookings);
    const overlappingB = getOverlappingBookings(b, existingBookings);
    
    // Final score calculation
    const scoreA = (
      (morningWeightA * regionWeight) +
      (isAMC ? 2 : 1) - // AMC slots get higher priority
      (overlappingA * NEARBY_BOOKING_PENALTY) -
      peakPenaltyA
    );

    const scoreB = (
      (morningWeightB * regionWeight) +
      (isAMC ? 2 : 1) -
      (overlappingB * NEARBY_BOOKING_PENALTY) -
      peakPenaltyB
    );
    
    return scoreB - scoreA;
  });
};

const getOverlappingBookings = (
  slot: TimeSlot,
  existingBookings: Array<{ datetime: string; region: Region; duration: number }>
): number => {
  const slotTime = new Date(slot.datetime);
  const slotEnd = addMinutes(slotTime, slot.duration || 60);
  
  let overlappingCount = 0;
  
  for (const booking of existingBookings) {
    const bookingTime = new Date(booking.datetime);
    const bookingEnd = addMinutes(bookingTime, booking.duration);
    
    // Check for time overlap including buffer
    const bufferedStart = addMinutes(bookingTime, -BUFFER_MINUTES);
    const bufferedEnd = addMinutes(bookingEnd, BUFFER_MINUTES);
    
    const isOverlapping = (
      (slotTime >= bufferedStart && slotTime < bufferedEnd) ||
      (slotEnd > bufferedStart && slotEnd <= bufferedEnd)
    );
    
    if (isOverlapping) {
      overlappingCount++;
      // Early return if we've hit the maximum
      if (overlappingCount >= MAX_OVERLAPPING_SLOTS) {
        return overlappingCount;
      }
    }
  }
  
  return overlappingCount;
};