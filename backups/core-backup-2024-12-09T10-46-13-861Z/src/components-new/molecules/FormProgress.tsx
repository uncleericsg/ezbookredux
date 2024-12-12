import { ComponentProps } from '@components/types';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface FormProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

const FormProgress = React.forwardRef<HTMLDivElement, FormProgressProps>(
  ({ className, steps, currentStep, completedSteps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        <div className="overflow-hidden">
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;

              return (
                <div
                  key={step.id}
                  className={cn(
                    'relative flex flex-col items-center',
                    index !== steps.length - 1 &&
                      'flex-1 after:absolute after:left-1/2 after:top-[15px] after:h-0.5 after:w-full after:bg-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCurrent
                        ? 'border-primary'
                        : 'border-gray-300'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    {step.description && (
                      <div className="mt-1 text-xs text-gray-500">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
FormProgress.displayName = 'FormProgress';

export { FormProgress };
