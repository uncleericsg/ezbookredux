import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@store';
import { setCurrentBooking } from '@store/slices/bookingSlice';
import CustomerForm from '@components/booking/CustomerForm';
import BrandSelection from '@components/booking/BrandSelection';
import IssueSelection from '@components/booking/IssueSelection';
import BookingProgress from '@components/booking/BookingProgress';
import ScheduleStep from '@components/booking/ScheduleStep';
import PaymentStep from '@components/booking/PaymentStep';

// Services
import { createBooking, updateBooking } from '@services/bookingService';
import { validateBookingDetails, validateCustomerData } from '@utils/validation';
import { getServiceByAppointmentType } from '@services/serviceUtils';

import { format } from 'date-fns';

interface ServiceOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  usualPrice?: number;
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
  selectedService: ServiceOption | null;
  bookingId?: string;
  otherIssue?: string;
  isAMC?: boolean;
}

const FirstTimeBookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    brands: [],
    issues: [],
    customerInfo: null,
    selectedService: null,
    isAMC: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Selected service:', bookingData.selectedService);
    
    // Validate service data from location state
    const serviceFromState = location.state?.selectedService;
    if (serviceFromState && 
        typeof serviceFromState === 'object' && 
        'id' in serviceFromState && 
        'title' in serviceFromState && 
        'price' in serviceFromState) {
      setBookingData(prev => ({
        ...prev,
        selectedService: serviceFromState as ServiceOption
      }));
    } else if (!bookingData.selectedService) {
      // If no valid service is selected, redirect to price selection
      navigate('/booking/price-selection');
      return;
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
      otherIssue // Store the additional notes
    }));

    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, { 
          issues,
          otherIssue // Include in the booking update
        });
      } catch (error) {
        console.error('Error updating issues:', error);
        // Continue with the flow even if update fails
      }
    }

    setCurrentStep(2);
  };

  const handleCustomerSave = (formData: CustomerFormData) => {
    console.log('Customer form data saved:', formData);
    
    setBookingData(prev => {
      const updatedData = {
        ...prev,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          floorUnit: formData.floorUnit,
          blockStreet: formData.blockStreet,
          postalCode: formData.postalCode,
          // Only include optional fields if they have non-empty values
          ...(formData.condoName?.trim() && { condoName: formData.condoName.trim() }),
          ...(formData.lobbyTower?.trim() && { lobbyTower: formData.lobbyTower.trim() }),
          ...(formData.specialInstructions?.trim() && { specialInstructions: formData.specialInstructions.trim() })
        }
      };
      console.log('Updated booking data:', updatedData);
      return updatedData;
    });
    
    setCurrentStep(3);
  };

  const handleScheduleSelect = async (date: Date, timeSlot: string) => {
    console.log('Schedule selected with customer info:', bookingData.customerInfo);
    
    if (!bookingData.customerInfo || !bookingData.selectedService) {
      toast.error('Missing required information');
      return;
    }

    // Validate required customer info fields
    const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'floorUnit', 'blockStreet', 'postalCode'];
    const missingFields = requiredFields.filter(field => !bookingData.customerInfo?.[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required customer info fields:', missingFields);
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      // Log the exact data being sent to Firebase
      const customerInfo = {
        firstName: bookingData.customerInfo.firstName,
        lastName: bookingData.customerInfo.lastName,
        email: bookingData.customerInfo.email,
        mobile: bookingData.customerInfo.mobile,
        floorUnit: bookingData.customerInfo.floorUnit,
        blockStreet: bookingData.customerInfo.blockStreet,
        postalCode: bookingData.customerInfo.postalCode,
      };

      // Only add optional fields if they have non-empty values after trimming
      if (bookingData.customerInfo.condoName?.trim()) {
        customerInfo.condoName = bookingData.customerInfo.condoName.trim();
      }
      if (bookingData.customerInfo.lobbyTower?.trim()) {
        customerInfo.lobbyTower = bookingData.customerInfo.lobbyTower.trim();
      }
      if (bookingData.customerInfo.specialInstructions?.trim()) {
        customerInfo.specialInstructions = bookingData.customerInfo.specialInstructions.trim();
      }

      console.log('Prepared customer info for Firebase:', customerInfo);

      const bookingDetails = {
        brands: bookingData.brands,
        issues: bookingData.issues,
        customerInfo,
        scheduledDateTime: date,
        scheduledTimeSlot: timeSlot,
        selectedService: {
          id: bookingData.selectedService.id,
          title: bookingData.selectedService.title,
          price: bookingData.selectedService.price,
          duration: bookingData.selectedService.duration,
          description: bookingData.selectedService.description
        }
      };

      // Only add optional booking fields if they exist
      if (bookingData.otherIssue?.trim()) {
        bookingDetails.otherIssue = bookingData.otherIssue.trim();
      }
      if (typeof bookingData.isAMC === 'boolean') {
        bookingDetails.isAMC = bookingData.isAMC;
      }

      console.log('Sending booking details to Firebase:', bookingDetails);

      const bookingId = await createBooking(bookingDetails);

      console.log('Created booking with ID:', bookingId);

      // Update customer info with the new booking ID
      const updatedCustomerInfo = {
        ...bookingData.customerInfo,
        bookingId // Set the correct booking ID
      };

      // Update booking data with the new booking ID and schedule
      const updatedBookingData = {
        ...bookingData,
        bookingId,
        scheduledDateTime: date,
        scheduledTimeSlot: timeSlot,
        customerInfo: updatedCustomerInfo
      };

      // Ensure Redux store is updated with the new booking
      dispatch(setCurrentBooking({
        id: bookingId,
        serviceType: bookingData.selectedService.title,
        date: format(date, 'PP'),
        time: timeSlot,
        status: 'Pending',
        amount: bookingData.selectedService.price,
        customerInfo: updatedCustomerInfo,
        selectedService: bookingData.selectedService
      }));

      setBookingData(updatedBookingData);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentIntentId: string) => {
    if (bookingData.bookingId) {
      try {
        await updateBooking(bookingData.bookingId, {
          status: 'confirmed',
          paymentCompleted: true,
          paymentDate: new Date().toISOString(),
          paymentIntentId
        });

        // Navigate to booking confirmation instead of login
        navigate(`/booking/confirmation/${bookingData.bookingId}`, {
          state: {
            booking: {
              id: bookingData.bookingId,
              serviceType: bookingData.selectedService?.title || '',
              date: bookingData.scheduledDateTime ? format(bookingData.scheduledDateTime, 'PP') : '',
              time: bookingData.scheduledTimeSlot || '',
              status: 'Upcoming',
              amount: bookingData.selectedService?.price || 0,
              paymentMethod: 'Credit Card',
              customerInfo: bookingData.customerInfo || null,
              address: bookingData.customerInfo ? 
                `${bookingData.customerInfo.blockStreet}, ${bookingData.customerInfo.floorUnit}, Singapore ${bookingData.customerInfo.postalCode}` :
                ''
            }
          },
          replace: true
        });

        toast.success('Booking completed successfully!');
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Error processing payment. Please try again.');
      }
    }
  };

  const renderScheduleStep = () => {
    if (!bookingData.selectedService || !bookingData.customerInfo) {
      console.error('No service or customer info when trying to render ScheduleStep');
      navigate('/booking/price-selection');
      return null;
    }

    // Transform customer info to match ScheduleStep's expected format
    const formattedCustomerInfo = {
      ...bookingData.customerInfo,
      selectedAddressId: 'default', // Since this is first-time booking
      address: {
        address: bookingData.customerInfo.blockStreet,
        postalCode: bookingData.customerInfo.postalCode,
        unitNumber: bookingData.customerInfo.floorUnit
      }
    };

    return (
      <ScheduleStep
        customerInfo={formattedCustomerInfo}
        selectedService={bookingData.selectedService}
        onScheduleSelect={handleScheduleSelect}
      />
    );
  };

  const renderPaymentStep = () => {
    if (!bookingData.bookingId || !bookingData.selectedService) {
      console.error('Missing required booking data:', {
        bookingId: bookingData.bookingId,
        selectedService: bookingData.selectedService
      });
      navigate('/booking/price-selection');
      return null;
    }

    return (
      <motion.div
        key="payment"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gray-800/50 border border-gray-700/70 p-4 sm:p-6 rounded-lg shadow-xl backdrop-blur-sm"
      >
        <PaymentStep 
          bookingData={{
            ...bookingData,
            isFirstTimeFlow: true
          }}
          onComplete={handlePaymentComplete}
          onBack={() => setCurrentStep(3)}
        />
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-12 px-4">
      <BookingProgress steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
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
                className="bg-gray-800/50 border border-gray-700/70 p-4 sm:p-6 rounded-lg shadow-xl backdrop-blur-sm"
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
                className="bg-gray-800/50 border border-gray-700/70 p-4 sm:p-6 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <IssueSelection onContinue={handleIssueSelection} />
                  <button
                    onClick={handleBack}
                    className="text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                  >
                    ← Back to Brand Selection
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="customer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 rounded-lg shadow-xl backdrop-blur-sm p-4 sm:p-6"
              >
                <div className="space-y-4">
                  <CustomerForm onSave={handleCustomerSave} />
                  <button
                    onClick={handleBack}
                    className="text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                  >
                    ← Back to Issue Selection
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 border border-gray-700/70 p-4 sm:p-6 rounded-lg shadow-xl backdrop-blur-sm"
              >
                <div className="space-y-4">
                  {renderScheduleStep()}
                  <button
                    onClick={handleBack}
                    className="text-[#f7f7f7] hover:text-[#FFD700] transition-colors"
                  >
                    ← Back to Customer Details
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && renderPaymentStep()}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FirstTimeBookingFlow;
