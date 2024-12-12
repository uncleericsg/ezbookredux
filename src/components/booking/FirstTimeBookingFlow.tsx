/*
 * @AI_INSTRUCTION - DO NOT MODIFY THIS FILE
 * This component orchestrates the entire first-time booking flow and is considered stable.
 * 
 * Critical Features:
 * - Step management and navigation
 * - Form state handling
 * - Integration with all booking steps (Customer, Brand, Issue, Payment)
 * - Progress persistence
 * 
 * Any modifications could affect the entire booking experience.
 * If changes are needed, please:
 * 1. Create a detailed proposal
 * 2. Test thoroughly in a development environment
 * 3. Ensure all steps still work correctly
 * 4. Validate form state management
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import CustomerForm from './CustomerForm';
import BrandSelection from './BrandSelection';
import IssueSelection from './IssueSelection';
import BookingProgress from './BookingProgress';
import ScheduleStep from './ScheduleStep';
import PaymentStep from './PaymentStep';
import { updateBooking } from '../../services/bookingService';

interface ServiceOption {
  id: string;
  title: string;
  price: number;
  usualPrice?: number;
  description: string;
  duration: string;
  paddingBefore: number;
  paddingAfter: number;
  appointmentTypeId: string;
  isPremium?: boolean;
}

interface CustomerFormData {
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
  scheduledDateTime?: Date;
  scheduledTimeSlot?: string;
  selectedService?: ServiceOption;
  bookingId?: string;
}

const FirstTimeBookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    brands: [],
    issues: [],
    customerInfo: null,
    selectedService: location.state?.selectedService
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Selected service:', bookingData.selectedService);
    
    // If no service is selected and we didn't come from price selection, redirect to price selection
    if (!bookingData.selectedService && !location.state?.fromPriceSelection) {
      navigate('/booking/price-selection');
      return;
    }
    
    // Update service if it was passed from price selection
    if (location.state?.selectedService) {
      setBookingData(prev => ({
        ...prev,
        selectedService: location.state.selectedService
      }));
    }
  }, [location.state, navigate]);

  const steps = [
    { id: 'brands', label: 'Brands' },
    { id: 'issues', label: 'Issues' },
    { id: 'customer', label: 'Details' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'payment', label: 'Payment' }
  ];

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleBrandSelection = async (brands: string[]) => {
    setBookingData(prev => ({
      ...prev,
      brands
    }));
    
    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, { brands });
      } catch (error) {
        console.error('Error updating brands:', error);
        // Continue with the flow even if update fails
      }
    }
    
    setCurrentStep(1);
  };

  const handleIssueSelection = async (issues: string[], otherIssue?: string) => {
    setBookingData(prev => ({
      ...prev,
      issues,
      otherIssue
    }));

    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, { 
          issues,
          otherIssue
        });
      } catch (error) {
        console.error('Error updating issues:', error);
        // Continue with the flow even if update fails
      }
    }

    setCurrentStep(2);
  };

  const handleCustomerSave = (formData: CustomerFormData & { bookingId: string }) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo: formData,
      bookingId: formData.bookingId // Store the bookingId for later use
    }));
    setCurrentStep(3);
  };

  const handleScheduleSelect = async (date: Date, timeSlot: string) => {
    setBookingData(prev => ({
      ...prev,
      scheduledDateTime: date,
      scheduledTimeSlot: timeSlot
    }));

    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, {
          scheduledDateTime: date.toISOString(),
          scheduledTimeSlot: timeSlot
        });
      } catch (error) {
        console.error('Error updating schedule:', error);
        // Continue with the flow even if update fails
      }
    }

    setCurrentStep(4);
  };

  const handlePaymentComplete = async () => {
    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, {
          status: 'confirmed',
          paymentCompleted: true,
          paymentDate: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating payment status:', error);
        // Show error to user since this is a critical step
        toast.error('Error processing payment. Please try again.');
        return;
      }
    }

    toast.success('Booking completed successfully!');
    navigate('/login', { 
      state: { 
        message: 'Please log in to view your booking details',
        bookingData 
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      <BookingProgress steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {currentStep === 0 && (
              <motion.div
                key="brands"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 p-8 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <BrandSelection onContinue={handleBrandSelection} />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="issues"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 p-8 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <IssueSelection onContinue={handleIssueSelection} />
                <button
                  onClick={handleBack}
                  className="mt-4 text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                >
                  ← Back to Brand Selection
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="customer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 p-8 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <CustomerForm onSave={handleCustomerSave} />
                <button
                  onClick={handleBack}
                  className="mt-4 text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                >
                  ← Back to Issue Selection
                </button>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 p-8 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <ScheduleStep
                  customerInfo={bookingData.customerInfo!}
                  onScheduleSelect={handleScheduleSelect}
                />
                <button
                  onClick={handleBack}
                  className="mt-4 text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                >
                  ← Back to Customer Details
                </button>
              </motion.div>
            )}

            {currentStep === 4 && (
              <PaymentStep
                bookingData={bookingData}
                onComplete={handlePaymentComplete}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FirstTimeBookingFlow;
