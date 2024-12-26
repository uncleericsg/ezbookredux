# ScheduleStep Component Integration Plan
**Last Updated: 2024-12-25 07:33:41 GMT+8**

## Overview
This document outlines the simplified implementation plan for optimizing the ScheduleStep component with location-based slot suggestions and business rule integration.

## Core Business Rules

### 1. Location Rules
- Region-based booking
- 5-8km distance rule between bookings
- Natural travel optimization through region grouping

### 2. Time Rules
- Operating hours: 9 AM - 6 PM
- No bookings on Sundays
- No bookings on public holidays
- Proper padding time between bookings (service-specific)

### 3. Search Configuration
```typescript
const BOOKING_CONFIG = {
  search: {
    INITIAL_DAYS: 10,    // First check 10 days
    MAX_DAYS: 95,        // Up to ~3 months ahead
    INCREMENT: 20,       // Check in 20-day chunks
  }
};
```

## Implementation Components

### 1. Core Types
```typescript
interface Location {
  lat: number;
  lng: number;
  postalCode: string;
  region: string;
}

interface ServiceTiming {
  duration: number;     // in minutes
  paddingBefore: number;
  paddingAfter: number;
}

interface BookingSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  isPeakHour: boolean;
}
```

### 2. Slot Optimizer Hook
```typescript
const useSlotOptimizer = () => {
  const findNextAvailableSlots = async ({
    location,
    serviceTiming,
  }) => {
    // Progressive slot search
    // Business day filtering
    // Distance-based filtering
    // Return available slots
  };

  return {
    findNextAvailableSlots,
    findAvailableSlots
  };
};
```

## Integration Flow

### 1. Address Selection (CustomerForm)
```typescript
const handleAddressSelect = async (place) => {
  const location = extractLocation(place);
  const slots = await findNextAvailableSlots({
    location,
    serviceTiming: selectedService
  });
  dispatch(setPreCalculatedSlots(slots));
};
```

### 2. Schedule Step
```typescript
const ScheduleStep = ({
  location,
  serviceTiming,
  preCalculatedSlots
}) => {
  // Use pre-calculated slots
  // Handle date changes
  // Show availability status
};
```

## File Structure
```
/src
  /hooks
    useSlotOptimizer.ts      // Core optimization logic
  /config
    businessDays.ts          // Business rules
    bookingConfig.ts         // Search configuration
  /components
    /booking
      CustomerForm.tsx       // Address selection
      ScheduleStep.tsx       // Slot selection
```

## Implementation Benefits

1. **Optimization**
   - Natural travel optimization through region grouping
   - Efficient slot searching
   - Pre-calculation for better UX

2. **Maintainability**
   - Single source of optimization logic
   - Simple, focused components
   - Clear business rules

3. **Reusability**
   - Works across all booking types
   - Consistent behavior
   - Configurable parameters

4. **User Experience**
   - Progressive slot search
   - Clear feedback
   - Graceful fallbacks

## Next Steps

1. **Implementation Priority**
   - Core slot optimizer hook
   - Business day filtering
   - Address selection integration
   - Schedule step updates

2. **Testing Requirements**
   - Business rule validation
   - Slot availability accuracy
   - Performance testing
   - User flow testing

## Notes
- All changes must maintain existing functionality
- Focus on simplicity and maintainability
- Ensure consistent behavior across booking types
- Monitor performance impact

---

**Note**: This implementation focuses on practical improvements without over-engineering. The core functionality is built around business rules and user experience.
