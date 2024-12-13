// @ai-visual-protection: This component's visual design and styling must be preserved exactly as is.
// Any modifications should only affect functionality, not appearance.

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserRedux } from '../../hooks/useUserRedux';
import ServicePricingSelection from '../ServicePricingSelection';
import ReturnCustomerSchedule from './ReturnCustomerSchedule';
import PaymentStep from './PaymentStep';
import BookingSelectionModal from '../modals/BookingSelectionModal';
import type { PricingOption, SavedLocation, SavedDetails, CustomerInfo, BookingData, ServicePricing } from '../../types/booking';

interface SavedLocation {
  id: string;
  address: string;
  postalCode: string;
  unitNumber: string;
  default: boolean;
}

interface SavedDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locations: SavedLocation[];
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  selectedAddressId: string;
  address: {
    address: string;
    postalCode: string;
    unitNumber: string;
  };
}

interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

interface BookingData {
  selectedService: PricingOption;
  scheduledDate: Date;
  timeSlot: string;
  customerInfo: CustomerInfo;
}

interface ServicePricing {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

const ReturnCustomerBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserRedux();
  const [step, setStep] = useState<'pricing' | 'schedule' | 'payment'>('pricing');
  const [selectedService, setSelectedService] = useState<PricingOption | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if we have a selected service from navigation
    const { state } = location;
    if (state?.selectedService) {
      console.log('[DEBUG] ReturnCustomerBooking - Received service from navigation:', state.selectedService);
      setSelectedService(state.selectedService);
      setShowAuthModal(true);
    }
  }, [location]);

  useEffect(() => {
    // Reset flow if user logs out
    if (!user && step !== 'pricing') {
      setStep('pricing');
      setSelectedService(null);
      setCustomerInfo(null);
    }
  }, [user, step]);

  const handlePricingSelect = (service: PricingOption) => {
    console.log('[DEBUG] ReturnCustomerBooking - Price selection handler start');
    console.log('[DEBUG] ReturnCustomerBooking - Received service:', service);
    
    try {
      setSelectedService(service);
      console.log('[DEBUG] ReturnCustomerBooking - Selected service updated');
      
      setShowAuthModal(true);
      console.log('[DEBUG] ReturnCustomerBooking - Modal visibility set to true');
    } catch (error) {
      console.error('[DEBUG] ReturnCustomerBooking - Error in price selection:', error);
    }
  };

  const handleModalClose = () => {
    console.log('ReturnCustomerBooking - handleModalClose called');
    setShowAuthModal(false);
  };

  const handleAuthSuccess = (details: SavedDetails, location: SavedLocation) => {
    console.log('ReturnCustomerBooking - handleAuthSuccess called with:', { details, location });
    
    if (!selectedService) {
      console.error('ReturnCustomerBooking - No service selected');
      return;
    }
    
    const info: CustomerInfo = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      mobile: details.phone,
      selectedAddressId: location.id,
      address: {
        address: location.address,
        postalCode: location.postalCode,
        unitNumber: location.unitNumber
      }
    };
    
    console.log('ReturnCustomerBooking - Setting customer info:', info);
    setCustomerInfo(info);
    setShowAuthModal(false);
    
    // Force a state update and step change
    requestAnimationFrame(() => {
      console.log('ReturnCustomerBooking - Changing step to schedule');
      setStep('schedule');
    });
  };

  const handleScheduleSelect = (date: Date, timeSlot: string) => {
    console.log('ReturnCustomerBooking - Schedule selected:', { date, timeSlot });
    setSelectedDateTime(date);
    setSelectedTimeSlot(timeSlot);
    setStep('payment');
  };

  const renderStep = () => {
    switch (step) {
      case 'pricing':
        return (
          <div className="w-full">
            <ServicePricingSelection onSelect={handlePricingSelect} />
          </div>
        );
      case 'schedule':
        if (!customerInfo || !selectedService) return null;
        return (
          <ReturnCustomerSchedule
            customerInfo={customerInfo}
            selectedService={selectedService}
            onScheduleSelect={handleScheduleSelect}
            onBack={() => setStep('pricing')}
          />
        );
      case 'payment':
        if (!customerInfo || !selectedService || !selectedDateTime) return null;
        return (
          <PaymentStep
            customerInfo={customerInfo}
            selectedService={selectedService}
            scheduledDate={selectedDateTime}
            timeSlot={selectedTimeSlot}
            onBack={() => setStep('schedule')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="booking-flow-container"
      >
        {renderStep()}
      </motion.div>

      {/* Modal Portal */}
      <div id="modal-root">
        <BookingSelectionModal
          isOpen={showAuthModal}
          onClose={handleModalClose}
          onSelectSavedDetails={handleAuthSuccess}
          onSelectNewBooking={() => {
            setShowAuthModal(false);
            navigate('/booking/first-time');
          }}
          selectedService={selectedService!}
        />
      </div>
    </div>
  );
};

export default ReturnCustomerBooking;
