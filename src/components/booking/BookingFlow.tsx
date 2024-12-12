import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminView } from '../../contexts/AdminViewContext';
import { useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import { QuickBookingPrompt } from './QuickBookingPrompt';
import { RadixDialog as Dialog } from '@components/organisms/Dialog';
import { fetchLastBooking, BookingDetails } from '../../services/bookingService';
import BrandSelection from './BrandSelection';
import IssueSelection from './IssueSelection';
import { ServiceLimitations } from './ServiceLimitations';
import BookingProgress from './BookingProgress';
import PaymentStep from './PaymentStep';
import ScheduleStep from './ScheduleStep';

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  specialInstructions?: string;
}

interface BookingData {
  brands: string[];
  issues: string[];
  customerInfo: CustomerFormData | null;
  otherIssue?: string;
  scheduledDateTime?: Date;
  scheduledTimeSlot?: string;
}

const BOOKING_TIMEOUT = 900; // 15 minutes in seconds

const BookingFlow: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isFeatureVisible } = useAdminView();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const [bookingData, setBookingData] = useState<BookingData>({
    brands: [],
    issues: [],
    customerInfo: null
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [previousBookingDetails, setPreviousBookingDetails] = useState<BookingDetails | null>(null);
  const [timeoutWarningOpen, setTimeoutWarningOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(BOOKING_TIMEOUT);

  // Define steps including the new schedule step
  const steps = [
    { id: 'brands', label: 'Select Brands' },
    { id: 'issues', label: 'Select Issues' },
    { id: 'customer', label: 'Customer Info' },
    { id: 'schedule', label: 'Schedule' },
    ...(isFeatureVisible('booking-payment') ? [{ id: 'payment', label: 'Payment' }] : [])
  ];

  useEffect(() => {
    if (user) {
      try {
        const fetchPreviousBooking = async () => {
          const lastBooking = await fetchLastBooking(user.id);
          if (lastBooking) {
            setPreviousBookingDetails(lastBooking);
            setShowQuickBooking(isFeatureVisible('booking-quick'));
          }
        };
        fetchPreviousBooking();
      } catch (error) {
        console.error('Error fetching previous booking:', error);
      }
    }
  }, [user, isFeatureVisible]);

  const handleCustomerSave = (formData: CustomerFormData) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo: formData
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleScheduleSelect = (date: Date, timeSlot: string) => {
    setBookingData(prev => ({
      ...prev,
      scheduledDateTime: date,
      scheduledTimeSlot: timeSlot
    }));
    if (isFeatureVisible('booking-payment')) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleBookingSubmit();
    }
  };

  const handleQuickBook = () => {
    if (previousBookingDetails) {
      setBookingData({
        brands: previousBookingDetails.brands,
        issues: previousBookingDetails.issues,
        customerInfo: previousBookingDetails.customerInfo
      });
      setCurrentStep(3); // Go to schedule step
    }
  };

  const handleBookingSubmit = async () => {
    try {
      // TODO: Implement booking submission
      console.log('Submitting booking:', bookingData);
      // Reset booking data and redirect to success page
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  // Format remaining time for display
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show quick booking prompt if available
  if (showQuickBooking && currentStep === 0) {
    return (
      <div className="max-w-md mx-auto">
        <QuickBookingPrompt
          previousBooking={previousBookingDetails}
          onQuickBook={handleQuickBook}
        />
      </div>
    );
  }

  // Transform user data to match CustomerForm's user prop interface
  const transformedUser = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.phone || '',
    addresses: [{
      id: '1',
      floorUnit: previousBookingDetails?.customerInfo.floorUnit || user.address || '',
      blockStreet: previousBookingDetails?.customerInfo.blockStreet || '',
      postalCode: previousBookingDetails?.customerInfo.postalCode || '',
      condoName: previousBookingDetails?.customerInfo.condoName || user.condoName,
      lobbyTower: previousBookingDetails?.customerInfo.lobbyTower || user.lobbyTower,
      isDefault: true
    }]
  } : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="fixed top-4 right-4 z-50">
        <span className="text-sm text-gray-500">
          Time remaining: {formatTimeRemaining(timeRemaining)}
        </span>
      </div>

      <BookingProgress steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="brands"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BrandSelection
              onContinue={(brands) => {
                setBookingData(prev => ({ ...prev, brands }));
                setCurrentStep(1);
              }}
            />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="issues"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <IssueSelection
              onContinue={(issues, otherIssue) => {
                setBookingData(prev => ({ ...prev, issues, otherIssue }));
                setCurrentStep(2);
              }}
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="customer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CustomerForm
              onSave={handleCustomerSave}
              user={transformedUser}
              isAMC={isFeatureVisible('amc-features')}
            />
          </motion.div>
        )}

        {currentStep === 3 && bookingData.customerInfo && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ScheduleStep
              customerInfo={bookingData.customerInfo}
              onScheduleSelect={handleScheduleSelect}
            />
          </motion.div>
        )}

        {currentStep === 4 && !isFeatureVisible('amc-features') && (
          <motion.div
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PaymentStep 
              bookingData={bookingData}
              onComplete={handleBookingSubmit} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={timeoutWarningOpen}
        onOpenChange={setTimeoutWarningOpen}
        title="Booking Session Timeout"
        description="Your booking session will expire soon. Would you like to continue?"
      >
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => {
              setTimeoutWarningOpen(false);
              setTimeRemaining(BOOKING_TIMEOUT);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue Booking
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default BookingFlow;