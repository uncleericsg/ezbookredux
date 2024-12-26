import React from 'react';
import FirstTimeBookingFlow from '@components/booking/FirstTimeBookingFlow';
import { useScrollToTop } from '@hooks/useScrollToTop';

const FirstTimeBookingFlowWrapper: React.FC = () => {
  // This will scroll to top whenever the component mounts
  useScrollToTop([]);

  return <FirstTimeBookingFlow />;
};

export default FirstTimeBookingFlowWrapper;
