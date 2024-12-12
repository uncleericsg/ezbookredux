import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useUser } from '../contexts/UserContext';
import { useAcuitySettings } from '../hooks/useAcuitySettings';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { BUSINESS_RULES } from '../constants';
import PaymentFlow from './PaymentFlow';
import { useAppointments } from '../hooks/useAppointments';
import { useBookingState } from '../hooks/useBookingState';
import { toast } from 'sonner';
import { validateBookingDetails } from '../utils/bookingValidation';
import { format } from 'date-fns';
import ErrorBoundary from './ErrorBoundary';
import { LoadingScreen } from './LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import type { AcuityAppointmentType } from '../services/acuityIntegration';
import ServiceSchedulingCalendar from './ServiceSchedulingCalendar';
import TimeSlotPicker from './TimeSlotPicker';
import ServiceSummary from './ServiceSummary';

const BookingErrorFallback: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="text-center py-8">
    <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20 mb-6">
      {error}
    </div>
    <button onClick={onRetry} className="btn btn-primary">Try Again</button>
  </div>
);

const ServiceScheduling: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, price, isAmcService } = location.state || {};
  const { user } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const { getAppointmentType } = useAcuitySettings();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const { bookNewAppointment, loading: bookingLoading } = useAppointments();
  const appointmentType = categoryId ? getAppointmentType(categoryId) : null;
  
  const { slots, loading: slotsLoading, error: slotsError } = useTimeSlots(
    selectedDate,
    categoryId,
    !!isAmcService,
    appointmentType
  );
  const { state: bookingState, dispatch: bookingDispatch } = useBookingState();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const hasNavigated = useRef(false);
  const bookingInProgressRef = useRef(false);

  // Cleanup function
  useEffect(() => {
    return () => {
      bookingInProgressRef.current = false;
    };
  }, []);

  // Validate category and user on mount
  useEffect(() => {
    if (!categoryId) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        toast.error('Invalid service category');
        navigate('/', { replace: true });
      }
      return;
    }

    if (!user) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        toast.error('Please log in to book appointments');
        navigate('/login', { replace: true });
      }
      return;
    }

    if (isAmcService && user.amcStatus !== 'active') {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        toast.error('Your AMC package is not active');
        navigate('/amc', { replace: true });
      }
      return;
    }

    setIsInitializing(false);
  }, [categoryId, user, isAmcService, navigate]);

  // Reset time selection when date changes
  useEffect(() => {
    setSelectedTime('');
    setValidationErrors([]);
  }, [selectedDate]);

  const handleSchedule = async () => {
    if (!selectedTime || !categoryId) {
      toast.error('Please select a time slot');
      return;
    }

    // For AMC services, skip payment
    if (isAmcService) {
      await processBooking();
    } else {
      setShowPayment(true);
    }
  };

  const processBooking = async () => {
    if (bookingInProgressRef.current) {
      toast.error('A booking is already in progress');
      return;
    }

    bookingInProgressRef.current = true;
    bookingDispatch({ type: 'START_BOOKING' });

    try {
      const validation = validateBookingDetails(user?.id, selectedTime, categoryId, isAmcService);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        toast.error(validation.errors[0]);
        return;
      }

      if (validation.warnings?.length) {
        validation.warnings.forEach(warning => toast.warning(warning));
      }

      const loadingToast = toast.loading('Scheduling your appointment...');
      
      await bookNewAppointment(selectedTime, categoryId);
      
      toast.dismiss(loadingToast);
      toast.success('Service scheduled successfully');
      
      bookingDispatch({ 
        type: 'BOOKING_SUCCESS',
        time: selectedTime
      });

    } catch (error) {
      const err = error as Error;
      
      if (err.message.includes('no longer available')) {
        setSelectedTime('');
        toast.error('This time slot is no longer available. Please select another time.');
      } else {
        toast.error(err.message || 'Failed to schedule service');
      }
      
      bookingDispatch({
        type: 'BOOKING_FAILED',
        error: err.message
      });
      
    } finally {
      bookingInProgressRef.current = false;
    }
  };

  if (isInitializing) {
    return <LoadingScreen message="Preparing booking form..." />;
  }

  if (bookingState.status === 'confirmed') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-4">
          Your appointment has been scheduled for {format(new Date(selectedTime), 'MMMM d, yyyy h:mm aa')}
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 btn btn-primary"
        >
          View Dashboard
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {showPayment ? (
        <PaymentFlow
          amount={price || 0}
          serviceDetails={{
            type: appointmentType?.name || 'Service',
            date: selectedDate?.toISOString() || '',
            time: selectedTime,
            duration: appointmentType?.duration || 60
          }}
          onSuccess={processBooking}
          onCancel={() => setShowPayment(false)}
        />
      ) : (
        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-400">
            {price && !isAmcService && (
              <span>Service fee: ${price}</span>
            )}
            {isAmcService && (
              <span className="text-blue-400">AMC Service Visit</span>
            )}
          </p>

          <AnimatePresence mode="wait">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              key={selectedDate?.toISOString() ?? 'no-date'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                {validationErrors.length > 0 && (
                  <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
                    {validationErrors[0]}
                  </div>
                )}

                <ServiceSchedulingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  disabled={bookingLoading}
                />
                
                {selectedDate && (
                  <TimeSlotPicker
                    slots={slots}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                    appointmentType={appointmentType}
                    loading={slotsLoading}
                    isAMC={isAmcService}
                    disabled={bookingLoading}
                  />
                )}
              </div>

              {selectedDate && selectedTime && (
                <ServiceSummary
                  date={selectedDate}
                  time={selectedTime}
                  appointmentType={appointmentType}
                  onConfirm={handleSchedule}
                  loading={bookingLoading}
                  price={price}
                  address={user?.address}
                  isAMC={isAmcService}
                  disabled={bookingInProgressRef.current}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </ErrorBoundary>
  );
};

export default ServiceScheduling;