import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import { differenceInDays, isValid } from 'date-fns';

const ServiceDueBanner: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAppSelector((state) => state.user);
  
  // Only show on homepage for non-admin users with a next service date
  if (!currentUser || 
      !currentUser.nextServiceDate || 
      currentUser.role === 'admin' || 
      location.pathname !== '/') {
    return null;
  }

  const nextServiceDate = currentUser.nextServiceDate ? new Date(currentUser.nextServiceDate) : null;
  const today = new Date();

  if (!nextServiceDate || !isValid(nextServiceDate)) {
    return null;
  }

  const daysUntilService = differenceInDays(nextServiceDate, today);
  const isAMC = currentUser.amcStatus === 'active';
  const threshold = isAMC ? 75 : 7; // Show 75 days for AMC, 7 days for regular

  if (daysUntilService > threshold || daysUntilService <= 0) {
    return null;
  }

  return (
    <div className="fixed top-16 right-0 w-1/2 bg-red-500/10 border-b border-red-500/20 py-2 z-10">
      <p className="px-4 text-right text-red-400 font-medium">
        Service Due Soon! Your service is due in {daysUntilService} days
      </p>
    </div>
  );
};

export default ServiceDueBanner;