import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '../contexts/UserContext';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'min-h-screen' 
    : 'min-h-[50vh]';

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        <Spinner size="xl" variant="yellow" className="mx-auto" />
        <h1 className="text-xl font-semibold mt-4 text-yellow-400">{message}</h1>
      </div>
    </div>
  );
};