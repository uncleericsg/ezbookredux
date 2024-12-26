import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load components
const BrandSelection = lazy(() => import('@components/booking/BrandSelection'));
const IssueSelection = lazy(() => import('@components/booking/IssueSelection'));
const CustomerForm = lazy(() => import('@components/booking/CustomerForm'));

interface BookingFlowProps {
  currentStep: number;
  onStepComplete: (step: number, data: any) => void;
}

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const OptimizedBookingFlow: React.FC<BookingFlowProps> = ({
  currentStep,
  onStepComplete
}) => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }>
        <motion.div
          key={currentStep}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="transform-gpu"
          style={{ willChange: 'transform, opacity' }}
        >
          {currentStep === 0 && (
            <BrandSelection
              onContinue={(brands) => onStepComplete(0, { brands })}
            />
          )}
          {currentStep === 1 && (
            <IssueSelection
              onContinue={(issues, otherIssue) => 
                onStepComplete(1, { issues, otherIssue })
              }
            />
          )}
          {currentStep === 2 && (
            <CustomerForm
              onSave={(data) => onStepComplete(2, data)}
            />
          )}
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};
