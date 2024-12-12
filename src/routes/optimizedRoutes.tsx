import React, { lazy, Suspense } from 'react';
import { LoadingState } from '../components/booking/components/LoadingState';

// Lazy load components
const OptimizedBookingFlow = lazy(() => 
  import('../components/booking/OptimizedBookingFlow').then(module => ({
    default: module.OptimizedBookingFlow
  }))
);

// Preload component function
export const preloadBookingComponents = () => {
  const preloadComponents = [
    import('../components/booking/BrandSelection'),
    import('../components/booking/IssueSelection'),
    import('../components/booking/CustomerForm'),
  ];

  return Promise.all(preloadComponents);
};

// Optimized booking route configuration
export const optimizedBookingRoute = {
  path: 'booking',
  element: (
    <Suspense fallback={<LoadingState />}>
      <OptimizedBookingFlow />
    </Suspense>
  ),
  loader: async () => {
    // Start preloading components
    preloadBookingComponents().catch(console.error);
    return null;
  },
  handle: {
    crumb: () => 'Booking',
  },
};
