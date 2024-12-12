import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface BookingProgressProps {
  currentStep: number;
  steps: Array<{
    id: string;
    label: string;
  }>;
  onStepClick?: (stepIndex: number) => void;
  completedSteps?: number[];
}

const BookingProgress: React.FC<BookingProgressProps> = ({
  currentStep: rawCurrentStep,
  steps,
  onStepClick,
  completedSteps = []
}) => {
  // Validate and normalize currentStep
  const currentStep = Math.max(0, Math.min(rawCurrentStep, steps.length - 1));

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      {/* Progress bar background */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#FFD700]"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index) || index < currentStep;
          const isActive = index === currentStep;
          const isClickable = onStepClick && (isCompleted || index <= Math.min(currentStep + 1, steps.length - 1));

          return (
            <div
              key={step.id}
              className={`
                flex flex-col items-center
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
              onClick={isClickable ? () => onStepClick(index) : undefined}
            >
              {/* Step circle */}
              <div
                className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200
                  ${isCompleted
                    ? 'bg-[#f7f7f7] border-[#f7f7f7] text-gray-900'
                    : isActive
                      ? 'bg-gray-900 border-[#f7f7f7] text-[#f7f7f7]'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-sm font-medium
                    ${isActive ? 'text-[#f7f7f7]' : isCompleted ? 'text-[#f7f7f7]' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;