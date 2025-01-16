import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import type { CreateBookingParams } from '@shared/types/booking';
import { useAuth } from '@/hooks/useAuth';
import { BookingProgress, BookingStep } from './BookingProgress';
import { ServiceStep } from './ServiceStep';
import { CustomerStep } from './CustomerStep';
import { ScheduleStep } from './ScheduleStep';
import { BookingStep as BookingConfirmStep } from './BookingStep';
import { PaymentStep } from './PaymentStep';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingFlowProps {
  className?: string;
}

const INITIAL_BOOKING_DATA: Partial<CreateBookingParams> = {
  service_id: '',
  service_title: '',
  service_description: '',
  service_price: 0,
  service_duration: 0,
  customer_first_name: '',
  customer_last_name: '',
  customer_email: '',
  customer_mobile: '',
  floor_unit: '',
  block_street: '',
  postal_code: '',
  condo_name: '',
  lobby_tower: '',
  special_instructions: '',
  scheduled_datetime: '',
  scheduled_timeslot: '',
  status: 'pending',
  brands: [],
  issues: []
};

const BookingFlow: React.FC<BookingFlowProps> = ({ className }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [bookingData, setBookingData] = useState<Partial<CreateBookingParams>>(INITIAL_BOOKING_DATA);

  // Initialize booking data with user information if available
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        customer_email: user.email || prev.customer_email,
        customer_first_name: user.firstName || prev.customer_first_name,
        customer_last_name: user.lastName || prev.customer_last_name
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
      router.push('/');
    }
  };

  const handleUpdateBookingData = (data: Partial<CreateBookingParams>) => {
    setBookingData(prev => ({
      ...prev,
      ...data
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'service':
        return (
          <ServiceStep
            onNext={handleNext}
            onBack={handleBack}
            bookingData={bookingData}
            onUpdateBookingData={handleUpdateBookingData}
          />
        );
      case 'customer':
        return (
          <CustomerStep
            onNext={handleNext}
            onBack={handleBack}
            bookingData={bookingData}
            onUpdateBookingData={handleUpdateBookingData}
          />
        );
      case 'schedule':
        return (
          <ScheduleStep
            onNext={handleNext}
            onBack={handleBack}
            bookingData={bookingData}
            onUpdateBookingData={handleUpdateBookingData}
          />
        );
      case 'booking':
        return (
          <BookingConfirmStep
            onNext={handleNext}
            onBack={handleBack}
            bookingData={bookingData}
            onUpdateBookingData={handleUpdateBookingData}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            onNext={handleNext}
            onBack={handleBack}
            bookingData={bookingData}
            onUpdateBookingData={handleUpdateBookingData}
          />
        );
      case 'confirmation':
        return (
          <BookingConfirmation
            booking={bookingData}
            onViewBookings={() => router.push('/bookings')}
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
        router.push('/');
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