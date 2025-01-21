import React from 'react';
import { BaseProps } from './types';

export const Skeleton: React.FC<BaseProps> = ({ 
  className = '' 
}) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
};
