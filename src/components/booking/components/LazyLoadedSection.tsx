import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadedSectionProps {
  children: React.ReactNode;
}

export const LazyLoadedSection: React.FC<LazyLoadedSectionProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
