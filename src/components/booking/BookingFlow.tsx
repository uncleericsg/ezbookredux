import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import type { 
  BookingStep, 
  BookingData, 
  BaseStepProps,
  PaymentStepProps,
  BookingConfirmationProps 
} from '../../types/booking-flow';
import { INITIAL_BOOKING_DATA } from '../../types/booking-flow';
import { useAuth } from '../../hooks/useAuth';
import BookingProgress from './BookingProgress';
import ServiceStep from './ServiceStep';
import CustomerStep from './CustomerStep';
import ScheduleStep from './ScheduleStep';
import BookingConfirmStep from './BookingStep';
import PaymentStep from './PaymentStep';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingFlowProps {
  className?: string;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ className }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [bookingData, setBookingData] = useState<BookingData>(INITIAL_BOOKING_DATA);
  const [paymentReference, setPaymentReference] = useState<string>();

  // Initialize booking data with user information if available
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          email: user.email || prev.customerInfo.email,
          firstName: user.firstName || prev.customerInfo.firstName,
          lastName: user.lastName || prev.customerInfo.lastName,
          phone: prev.customerInfo.phone
        }
      }));
    }
  }, [user]);

  const handleNext = () => {
    const steps: BookingStep[] = ['service', 'customer', 'schedule', 'booking', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['service', 'customer', 'schedule', 'booking', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      void router.push('/');
    }
  };

  const handleUpdateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({
      ...prev,
      ...data,
      brands: data.brands || prev.brands,
      issues: data.issues || prev.issues
    }));
  };

  const handlePaymentComplete = (reference: string) => {
    setPaymentReference(reference);
    handleNext();
  };

  const handleViewBookings = useCallback(async () => {
    try {
      await router.push('/bookings');
    } catch (error) {
      console.error('Navigation failed:', error);
      toast.error('Failed to navigate to bookings page');
    }
  }, [router]);

  const stepProps: BaseStepProps = {
    onNext: handleNext,
    onBack: handleBack,
    bookingData,
    onUpdateBookingData: handleUpdateBookingData
  };

  const paymentProps: PaymentStepProps = {
    ...stepProps,
    onComplete: handlePaymentComplete
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'service':
        return <ServiceStep {...stepProps} />;
      case 'customer':
        return <CustomerStep {...stepProps} />;
      case 'schedule':
        return <ScheduleStep {...stepProps} />;
      case 'booking':
        return <BookingConfirmStep {...stepProps} />;
      case 'payment':
        return <PaymentStep {...paymentProps} />;
      case 'confirmation':
        return (
          <BookingConfirmation
            booking={bookingData}
            onViewBookings={handleViewBookings}
          />
        );
      default:
        return null;
    }
  };

  // Session timeout warning
  useEffect(() => {
    const warningTimeout = setTimeout(() => {
      if (currentStep !== 'confirmation') {
        toast.warning('Your booking session will expire in 5 minutes', {
          duration: 10000
        });
      }
    }, 15 * 60 * 1000); // 15 minutes

    const sessionTimeout = setTimeout(() => {
      if (currentStep !== 'confirmation') {
        toast.error('Your booking session has expired', {
          duration: 5000
        });
        void router.push('/');
      }
    }, 20 * 60 * 1000); // 20 minutes

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(sessionTimeout);
    };
  }, [currentStep, router]);

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Indicator */}
        <BookingProgress currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

BookingFlow.displayName = 'BookingFlow';

export default BookingFlow;
