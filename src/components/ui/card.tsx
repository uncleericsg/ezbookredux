import React from 'react';
import { BaseProps } from './types';

export const Card: React.FC<BaseProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);
