# ScheduleStep Component Integration Plan

## Overview
This document outlines the plan for enhancing the existing ScheduleStep component with improved location optimization, route caching features, and service handling.

## Pre-Implementation Requirements

### 1. Current Codebase Analysis
- [x] Review current ScheduleStep implementation
- [x] Document existing dependencies
- [x] Identify integration points
- [x] Map current data flow
- [x] Review service data handling
- [x] Analyze price formatting requirements

### 2. Existing Components to Modify
- [ ] src/services/locations/optimizer.ts
- [ ] src/services/locations/regions.ts
- [ ] src/hooks/useLocationOptimizer.ts
- [ ] src/hooks/useTimeSlots.ts
- [ ] src/components/booking/OptimizedLocationProvider.tsx
- [ ] src/components/booking/ScheduleStep.tsx
- [x] src/components/booking/BookingSummary.tsx
- [x] src/constants/serviceConfig.ts
- [x] src/components/booking/PriceSelectionPage.tsx
- [x] src/store/slices/serviceSlice.ts
- [x] src/components/booking/FirstTimeBookingFlow.tsx

### 3. Type Updates Required
```typescript
// In src/types/location.ts
interface Region {
  id: string;
  name: string;
  postalCodes: string[];
  maxCapacity: number;
  bufferZones: string[];
}

// In src/types/booking.ts
interface TimeSlot {
  time: string;
  available: boolean;
  isPeakHour: boolean;
  endTime?: string;
  bufferTime?: number;
  travelTime?: number;
}

// In src/types/service.ts
interface ServiceOption extends Partial<ServiceConfig> {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  appointmentTypeId?: string;
}

interface ServiceRequest {
  serviceType: string;  // Service ID
  serviceTitle: string;
  price: number;
  duration: string;
  isSignatureService: boolean;
  isAmcService: boolean;
  id: string;
}

interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: number;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

// In src/services/locations/optimizer.ts
interface RouteCache {
  regionCapacity: Record<Region['id'], number>;
  travelTimes: Record<string, number>;
  techniciansAvailable: number;
  peakHourAdjustments: Record<number, number>;
  regionBuffers: Record<Region['id'], string[]>;
}

// In src/hooks/useLocationOptimizer.ts
interface LocationOptimizerProps {
  address: string;
  date: Date;
  slots: TimeSlot[];
  existingBookings?: Booking[];
  isAMC: boolean;
  useRouteCache?: boolean;
  region?: Region;
}

interface LocationOptimizerResult {
  optimizedSlots: TimeSlot[];
  loading: boolean;
  error: Error | null;
  region: Region | null;
  routeCache: RouteCache | null;
}

// In src/types/schedule.ts
export interface TimeSlot {
  time: string;
  available: boolean;
  isPeakHour: boolean;
  endTime?: string;
  isBufferTime?: boolean;
  travelTime?: number;
  bufferBefore?: number;
  bufferAfter?: number;
}

export interface RouteCache {
  postalCode: string;
  date: string;
  slots: {
    [key: string]: {
      available: boolean;
      travelTime: number;
      bufferTime: number;
    }
  };
  lastUpdated: string;
  validUntil: string;
}

export interface ScheduleStepProps {
  customerInfo: CustomerInfo;
  selectedService: PricingOption;
  onScheduleSelect: (date: Date, timeSlot: string, duration: number) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}
```

## Implementation Phases

### Phase 1: Service Data Enhancement (Completed)
#### File: src/constants/serviceConfig.ts
- [x] Add formatPrice helper function
- [x] Update formatServicePrice to use formatPrice
- [x] Add service validation utilities
- [x] Add error handling for service lookups

#### File: src/components/booking/BookingSummary.tsx
- [x] Update service data handling
- [x] Implement direct price formatting
- [x] Add service validation
- [x] Enhance error states

#### File: src/store/slices/serviceSlice.ts
- [x] Add explicit ID field to ServiceRequest
- [x] Modify setCurrentRequest reducer
- [x] Ensure serviceType preservation
- [x] Improve error handling

### Phase 2: UI Enhancement (Completed)
#### File: src/components/booking/FirstTimeBookingFlow.tsx
- [x] Add consistent bottom padding
- [x] Maintain existing top padding
- [x] Ensure responsive layout
- [x] Validate layout across steps

### Phase 3: Cache Integration & Enhancement
#### Existing Cache System Analysis
- [x] Identified existing cache implementation in utils/cache.ts
- [x] Reviewed CacheWarmer and CacheMonitor functionality
- [x] Analyzed current cache metrics and structure
- [x] Evaluated existing cache utilities

#### Cache Extension (src/utils/cache.ts)
- [ ] Extend CacheEntry interface for route data:
```typescript
interface CacheEntry {
  slots: TimeSlot[];
  timestamp: number;
  region: Region;
  params: Record<string, unknown>;
  routeInfo?: {
    travelTime: number;
    regionCapacity: number;
    lastUpdated: Date;
  };
}
```
- [ ] Add route-specific cache invalidation rules
- [ ] Update CacheWarmer for route preloading
- [ ] Implement simple performance monitoring

#### Cache Monitoring Enhancement (src/utils/cacheUtils.ts)
- [ ] Add route-specific metrics to CacheMonitor
- [ ] Implement postal code prefix matching
- [ ] Add time-based cache invalidation
- [ ] Update cache inspection tools

### Phase 4: Location Service Enhancement
#### File: src/services/locations/regions.ts
- [ ] Integrate with existing CacheWarmer
- [ ] Update region capacity calculations
- [ ] Add buffer zone management
- [ ] Add postal code validation

#### File: src/services/locations/optimizer.ts
- [ ] Update RouteCache to use existing CacheEntry
- [ ] Modify optimizeTimeSlots for cache awareness
- [ ] Add route-based optimization logic
- [ ] Integrate with region buffer zones
- [ ] Update unit tests

### Phase 5: Hook Integration
#### File: src/hooks/useTimeSlots.ts
- [ ] Integrate with extended CacheEntry
- [ ] Update slot generation for cache awareness
- [ ] Add buffer time calculations
- [ ] Implement cache hit/miss tracking

#### File: src/hooks/useLocationOptimizer.ts
- [ ] Update to use existing cache system
- [ ] Implement cache warming for common routes
- [ ] Add error handling for cache misses
- [ ] Integrate with CacheMonitor

### Phase 6: Component Integration
#### File: src/components/booking/ScheduleStep.tsx
- [ ] Update to use enhanced hooks
- [ ] Add loading states for cache operations
- [ ] Implement error handling for cache failures
- [ ] Add cache status indicators

#### File: src/components/booking/OptimizedLocationProvider.tsx
- [ ] Integrate with enhanced location optimizer
- [ ] Add cache preloading for selected regions
- [ ] Implement cache status monitoring
- [ ] Add performance tracking

### Cache Performance Metrics
We will track these simple metrics using the existing CacheMonitor:
- Cache hit rate (% of requests served from cache)
- Cache invalidation frequency
- Average response time (cached vs uncached)
- Memory usage of cache
- Cache size (number of routes stored)

### Implementation Notes
1. Using existing cache infrastructure:
   - CacheWarmer for preloading common routes
   - CacheMonitor for performance tracking
   - Existing cache utilities for key generation

2. Simple cache invalidation rules:
   - Clear region availability cache every 4 hours
   - Clear travel times daily
   - Immediate invalidation on technician schedule updates

3. Memory efficiency:
   - Cache by postal code prefix
   - Focus on commonly used routes
   - Regular cleanup of stale entries

4. Error handling:
   - Graceful fallback to uncached operation
   - Automatic retry on cache miss
   - Error reporting through existing monitors

## Testing Updates for ScheduleStep:
#### Unit Tests
- [ ] Test date selection
- [ ] Test time slot selection
- [ ] Test route cache integration
- [ ] Test peak hour handling
- [ ] Test buffer time handling
- [ ] Test error states
- [ ] Test loading states
- [ ] Test accessibility
- [ ] Test responsive design

#### Integration Tests
- [ ] Test with real route cache
- [ ] Test with real time slots
- [ ] Test with real service data
- [ ] Test with real customer data

#### Performance Tests
- [ ] Test route cache performance
- [ ] Test time slot generation
- [ ] Test date selection performance
- [ ] Test animations performance

## Testing Requirements

### 1. Unit Tests
#### Service Configuration (Completed)
- [x] Price formatting
- [x] Service validation
- [x] Error handling
- [x] Service data transformation

#### BookingSummary Component (Completed)
- [x] Service data display
- [x] Price formatting
- [x] Error states
- [x] Service validation

#### Region Service (regions.ts)
- [ ] Region capacity calculations
- [ ] Buffer zone management
- [ ] Postal code validation

#### Location Optimizer (optimizer.ts)
- [ ] Route cache integration
- [ ] Optimization algorithm
- [ ] Buffer zone handling
- [ ] Cache update mechanism

#### Time Slots Hook (useTimeSlots.ts)
- [ ] Slot generation
- [ ] Buffer calculations
- [ ] Cache integration

#### Location Hook (useLocationOptimizer.ts)
- [ ] Cache state management
- [ ] Region handling
- [ ] Error handling
- [ ] Address validation

#### Location Provider (OptimizedLocationProvider.tsx)
- [ ] Context updates
- [ ] Cache propagation
- [ ] Region updates
- [ ] Error boundaries

#### ScheduleStep Component
- [ ] Props validation
- [ ] Time slot selection
- [ ] Duration handling
- [ ] Region integration

### 2. Integration Tests
- [ ] Full booking flow
- [ ] Service selection to payment
- [ ] Location optimization
- [ ] Route caching
- [ ] Error recovery

### 3. Performance Tests
- [ ] Route cache efficiency
- [ ] Location optimization speed
- [ ] Time slot generation
- [ ] Service data handling

## Deployment Strategy
1. Service Data Updates (Completed)
   - [x] Deploy service configuration changes
   - [x] Update price formatting
   - [x] Validate service handling

2. UI Updates (Completed)
   - [x] Deploy layout improvements
   - [x] Verify responsive design
   - [x] Test all booking steps

3. Location Features (Pending)
   - [ ] Deploy region updates
   - [ ] Enable route caching
   - [ ] Monitor performance
   - [ ] Gather metrics

## Rollback Plan
1. Service Data
   - Keep previous service handling code
   - Monitor error rates
   - Prepare quick rollback scripts

2. Location Features
   - Deploy in phases
   - Monitor each region
   - Keep fallback options

## Success Metrics
1. Service Handling
   - Zero service ID errors
   - Consistent price display
   - Smooth booking flow

2. Location Optimization
   - Improved route efficiency
   - Reduced travel times
   - Better region distribution
