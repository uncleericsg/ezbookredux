import { useState, useEffect } from 'react';
import { FormData } from './useFormValidation';

interface FieldWeight {
  field: keyof FormData;
  weight: number;
}

const FIELD_WEIGHTS: FieldWeight[] = [
  { field: 'firstName', weight: 10 },
  { field: 'lastName', weight: 10 },
  { field: 'email', weight: 15 },
  { field: 'mobile', weight: 15 },
  { field: 'blockStreet', weight: 20 },
  { field: 'postalCode', weight: 15 },
  { field: 'floorUnit', weight: 10 },
  { field: 'specialInstructions', weight: 5 }
];

const ESTIMATED_TIME_PER_FIELD = 15; // seconds

export const useFormProgress = (formData: FormData) => {
  const [progress, setProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);

  useEffect(() => {
    let completedWeight = 0;
    const totalWeight = FIELD_WEIGHTS.reduce((sum, { weight }) => sum + weight, 0);

    FIELD_WEIGHTS.forEach(({ field, weight }) => {
      if (formData[field] && formData[field].length > 0) {
        completedWeight += weight;
      }
    });

    const newProgress = Math.round((completedWeight / totalWeight) * 100);
    setProgress(newProgress);

    // Calculate estimated time remaining
    const remainingFields = FIELD_WEIGHTS.filter(
      ({ field }) => !formData[field] || formData[field].length === 0
    ).length;
    setEstimatedTimeRemaining(remainingFields * ESTIMATED_TIME_PER_FIELD);
  }, [formData]);

  const getProgressColor = () => {
    if (progress < 33) return 'text-red-500';
    if (progress < 66) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTimeRemaining = () => {
    if (estimatedTimeRemaining === 0) return 'Complete!';
    if (estimatedTimeRemaining < 60) return `About ${estimatedTimeRemaining} seconds`;
    const minutes = Math.ceil(estimatedTimeRemaining / 60);
    return `About ${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return {
    progress,
    estimatedTimeRemaining,
    getProgressColor,
    formatTimeRemaining
  };
};
