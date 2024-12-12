import React, { useEffect } from 'react';

interface ScrollToTopWrapperProps {
  children: React.ReactNode;
  currentStep: number;
}

export const ScrollToTopWrapper: React.FC<ScrollToTopWrapperProps> = ({ children, currentStep }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  return <>{children}</>;
};
