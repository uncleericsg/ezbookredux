import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiUsers, FiX, FiPhone, FiArrowRight, FiMapPin, FiEdit2, FiCheck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser as setReduxUser } from '../../store/slices/userSlice';
import { toast } from 'sonner';
import { OTPInput } from '../common/OTPInput';

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

interface BookingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSavedDetails: (details: SavedDetails, location: SavedLocation, service: PricingOption) => void;
  onSelectNewBooking: () => void;
  selectedService: PricingOption;
}

const BookingSelectionModal: React.FC<BookingSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectSavedDetails,
  onSelectNewBooking,
  selectedService
}) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSavedDetails, setShowSavedDetails] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Mock saved details for testing
  const savedDetails: SavedDetails = {
    firstName: 'Test',
    lastName: 'User',
    phone: '91874498',
    email: 'test@example.com',
    locations: [
      {
        id: '1',
        address: 'Block 123 Ang Mo Kio Avenue 6',
        postalCode: '560123',
        unitNumber: '#12-345',
        default: true
      },
      {
        id: '2',
        address: 'Block 456 Tampines Street 42',
        postalCode: '520456',
        unitNumber: '#08-123',
        default: false
      }
    ]
  };

  const handleMobileSubmit = () => {
    if (mobileNumber === '91874498') {
      setShowOtpInput(true);
      toast.success('OTP sent to your mobile number');
    } else {
      toast.error('Invalid mobile number. For testing, use: 91874498');
    }
  };

  const handleMobileKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && mobileNumber.length > 0) {
      handleMobileSubmit();
    }
  };

  const handleOtpComplete = (otp: string) => {
    console.log('BookingSelectionModal - OTP completed:', otp);
    if (otp === '123456') {
      const userData = {
        id: mobileNumber,
        phone: mobileNumber,
        role: 'regular' as const,
        firstName: savedDetails.firstName,
        lastName: savedDetails.lastName,
        email: savedDetails.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookings: [],
      };

      dispatch(setReduxUser(userData));
      
      // Important: Set these states in the correct order
      requestAnimationFrame(() => {
        setShowOtpInput(false);
        setShowSignIn(false);
        setShowSavedDetails(true);
        toast.success('Successfully signed in! Please select a service location.');
      });
    } else {
      toast.error('Invalid OTP. For testing, use: 123456');
    }
  };

  const handleUseAccount = () => {
    if (user) {
      setShowSavedDetails(true);
    } else {
      setShowSignIn(true);
      // Focus the mobile input field after the sign-in screen is shown
      requestAnimationFrame(() => {
        mobileInputRef.current?.focus();
      });
    }
  };

  const handleLocationSelect = (locationId: string) => {
    console.log('BookingSelectionModal - Location selected:', locationId);
    setSelectedLocation(locationId);
  };

  const handleProceed = () => {
    console.log('BookingSelectionModal - handleProceed called');
    if (!selectedLocation || !savedDetails) {
      console.error('BookingSelectionModal - Missing required data for proceeding');
      return;
    }

    const location = savedDetails.locations.find(loc => loc.id === selectedLocation);
    if (!location) {
      console.error('BookingSelectionModal - Selected location not found');
      return;
    }

    console.log('BookingSelectionModal - Proceeding with location:', location);
    onSelectSavedDetails(savedDetails, location, selectedService);
    
    // Reset modal state
    setShowSignIn(false);
    setShowSavedDetails(false);
    setShowOtpInput(false);
    setSelectedLocation(null);
    setMobileNumber('');
  };

  useEffect(() => {
    if (!isOpen) {
      setShowSignIn(false);
      setShowSavedDetails(false);
      setShowOtpInput(false);
      setSelectedLocation(null);
      setMobileNumber('');
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('BookingSelectionModal - Modal mounted');
    console.log('BookingSelectionModal - isOpen:', isOpen);
    console.log('BookingSelectionModal - selectedService:', selectedService);
    
    return () => {
      console.log('BookingSelectionModal - Modal unmounted');
    };
  }, [isOpen, selectedService]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg p-6 bg-gray-900 rounded-xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Initial Welcome Screen */}
            {!showSignIn && !showSavedDetails && !showOtpInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Welcome Back!
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleUseAccount}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-white">Use Saved Account</span>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-[#FFD700]" />
                  </button>
                  <button
                    onClick={onSelectNewBooking}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:border-[#FFD700]/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FiUsers className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Book with New Details</span>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Sign In Screen */}
            {showSignIn && !showOtpInput && !showSavedDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Sign In
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-400 mb-1">
                      Mobile Number
                    </label>
                    <input
                      ref={mobileInputRef}
                      type="tel"
                      id="mobile"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      onKeyPress={handleMobileKeyPress}
                      placeholder="Enter your mobile number"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                  <button
                    onClick={handleMobileSubmit}
                    disabled={!mobileNumber}
                    className="w-full py-2 px-4 bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Screen */}
            {showOtpInput && !showSavedDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Enter OTP
                </h2>
                <p className="text-gray-400">Enter the 6-digit code sent to your mobile number</p>
                <OTPInput onComplete={handleOtpComplete} />
              </motion.div>
            )}

            {/* Location Selection Screen */}
            {showSavedDetails && !showSignIn && !showOtpInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Select Service Location
                </h2>

                {/* Service Locations */}
                <div className="space-y-4">
                  {savedDetails.locations.map((location) => (
                    <motion.button
                      key={location.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLocationSelect(location.id)}
                      className={`w-full p-4 rounded-lg border ${
                        selectedLocation === location.id
                          ? 'border-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10'
                          : 'border-gray-700 hover:border-[#FFD700]/50'
                      } transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FiMapPin className={`w-5 h-5 ${selectedLocation === location.id ? 'text-[#FFD700]' : 'text-gray-400'}`} />
                          <div className="text-left">
                            <p className={`font-medium ${selectedLocation === location.id ? 'text-white' : 'text-gray-300'}`}>
                              {location.address}
                            </p>
                            <p className="text-sm text-gray-400">{location.unitNumber}</p>
                          </div>
                        </div>
                        {selectedLocation === location.id && (
                          <FiCheck className="w-5 h-5 text-[#FFD700]" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  disabled={!selectedLocation}
                  className="w-full py-2 px-4 bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Proceed
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSelectionModal;
