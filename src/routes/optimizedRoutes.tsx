import React, { Suspense } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';

// Using dynamic import with type assertion to ensure proper typing
const OptimizedBookingFlow = React.lazy(() => 
  import('@/components/booking/OptimizedBookingFlow').then(module => ({
    default: module.default || module
  }))
);

export const optimizedBookingRoute = {
  path: 'optimized',
  element: (
    <Suspense fallback={<LoadingScreen />}>
      <OptimizedBookingFlow />
    </Suspense>
  )
};
