import React, { Suspense } from 'react';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { Loader2 } from 'lucide-react';

const FirstTimeBookingFlow = React.lazy(() => 
  import('@components/booking/FirstTimeBookingFlow')
);

const FirstTimeBookingFlowWrapper: React.FC = () => {
  // This will scroll to top whenever the component mounts
  useScrollToTop([]);

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    }>
      <FirstTimeBookingFlow />
    </Suspense>
  );
};

export default FirstTimeBookingFlowWrapper;
