# ScheduleStep Component Integration Plan

## Overview
This document outlines the plan for enhancing the existing ScheduleStep component with improved location optimization and route caching features.

## Pre-Implementation Requirements

### 1. Current Codebase Analysis
- [x] Review current ScheduleStep implementation
- [x] Document existing dependencies
- [x] Identify integration points
- [x] Map current data flow

### 2. Existing Components to Modify
- [ ] src/services/locations/optimizer.ts
- [ ] src/hooks/useLocationOptimizer.ts
- [ ] src/components/booking/OptimizedLocationProvider.tsx
- [ ] src/components/booking/ScheduleStep.tsx

### 3. Type Updates Required
```typescript
// In src/services/locations/optimizer.ts
interface RouteCache {
  regionCapacity: Record<Region, number>;
  travelTimes: Record<string, number>;
  techniciansAvailable: number;
  peakHourAdjustments: Record<number, number>;
}

// In src/hooks/useLocationOptimizer.ts
interface LocationOptimizerProps {
  address: string;
  date: Date;
  slots: TimeSlot[];
  existingBookings?: Booking[];
  isAMC: boolean;
  useRouteCache?: boolean;
}

// In src/components/booking/ScheduleStep.tsx
interface ScheduleStepProps {
  customerInfo: CustomerInfo;
  selectedService: PricingOption & {
    duration: number; // Changed from string
  };
  onScheduleSelect: (date: Date, timeSlot: string, duration: number) => void;
}
```

## Implementation Phases

### Phase 1: Location Optimizer Service Enhancement
#### File: src/services/locations/optimizer.ts
- [ ] Add RouteCache interface
- [ ] Update optimizeTimeSlots parameters
- [ ] Add route-based optimization logic
- [ ] Update unit tests

```typescript
export const optimizeTimeSlots = (
  date: Date,
  slots: TimeSlot[],
  region: Region,
  existingBookings: Booking[],
  options: {
    routeCache?: RouteCache;
    isAMC?: boolean;
    maxSlotsPerRegion?: number;
  }
): TimeSlot[]
```

### Phase 2: Location Hook Enhancement
#### File: src/hooks/useLocationOptimizer.ts
- [ ] Add route cache state management
- [ ] Update hook parameters
- [ ] Add route cache fetching logic
- [ ] Update error handling

```typescript
const useLocationOptimizer = ({
  address,
  date,
  slots,
  existingBookings,
  isAMC,
  useRouteCache
}: LocationOptimizerProps): LocationOptimizerResult
```

### Phase 3: Location Provider Updates
#### File: src/components/booking/OptimizedLocationProvider.tsx
- [ ] Add route cache context
- [ ] Implement route cache fetching
- [ ] Add cache update mechanisms
- [ ] Update error boundary handling

```typescript
interface OptimizedLocationContext {
  routeCache: RouteCache | null;
  updateRouteCache: (cache: RouteCache) => void;
}
```

### Phase 4: ScheduleStep Integration
#### File: src/components/booking/ScheduleStep.tsx
- [ ] Update component props
- [ ] Integrate route cache
- [ ] Update time slot handling
- [ ] Enhance error states

## Testing Requirements

### 1. Unit Tests
#### Location Optimizer (optimizer.ts)
- [ ] Route cache integration
- [ ] Optimization algorithm
- [ ] Cache update mechanism

#### Location Hook (useLocationOptimizer.ts)
- [ ] Cache state management
- [ ] Error handling
- [ ] Address validation

#### Location Provider (OptimizedLocationProvider.tsx)
- [ ] Context updates
- [ ] Cache propagation
- [ ] Error boundaries

#### ScheduleStep Component
- [ ] Props validation
- [ ] Time slot selection
- [ ] Duration handling

### 2. Integration Tests
- [ ] Complete booking flow
- [ ] Location optimization
- [ ] Route cache updates
- [ ] Error handling

### 3. Performance Tests
- [ ] Cache response time
- [ ] Optimization speed
- [ ] UI responsiveness

## Deployment Strategy

### 1. Staged Rollout
- [ ] Deploy backend changes first
- [ ] Update frontend in phases
- [ ] Enable feature flags

### 2. Monitoring
- [ ] Track optimization metrics
- [ ] Monitor error rates
- [ ] Measure performance impact

## Rollback Plan
1. Disable route cache feature flag
2. Revert to previous optimizer version
3. Roll back frontend changes

## Dependencies
- Current implementation files
- Existing test suites
- Type definitions
- Business rules

## Sign-off Requirements
- [ ] Frontend Lead Review
- [ ] Backend Lead Review
- [ ] QA Verification
- [ ] Performance Testing
- [ ] Security Review

## Notes
- All changes must maintain existing functionality
- Performance impact must be monitored
- Error handling must be comprehensive
- Documentation must be updated
