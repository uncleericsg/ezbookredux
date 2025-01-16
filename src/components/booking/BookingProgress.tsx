import React from 'react';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineCreditCard,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import { cn } from '@/utils/cn';

export type BookingStep = 'service' | 'customer' | 'schedule' | 'booking' | 'payment' | 'confirmation';

interface BookingProgressProps {
  currentStep: BookingStep;
  className?: string;
}

const STEPS: { id: BookingStep; label: string; icon: React.ElementType }[] = [
  {
    id: 'service',
    label: 'Service',
    icon: HiOutlineWrenchScrewdriver
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: HiOutlineUser
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: HiOutlineCalendarDays
  },
  {
    id: 'booking',
    label: 'Booking',
    icon: HiOutlineClipboardDocumentList
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: HiOutlineCreditCard
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    icon: HiOutlineCheckCircle
  }
];

const BookingProgress: React.FC<BookingProgressProps> = ({
  currentStep,
  className
}) => {
  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-700">
          <div
            className="absolute top-0 left-0 h-full bg-yellow-500 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                {/* Step Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isCompleted ? 'bg-yellow-500 text-black' :
                    isCurrent ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-700 text-gray-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-sm font-medium transition-colors',
                    isCompleted ? 'text-yellow-500' :
                    isCurrent ? 'text-yellow-500' :
                    'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

BookingProgress.displayName = 'BookingProgress';

export default BookingProgress;