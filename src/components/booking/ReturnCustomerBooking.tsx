import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useBookingHistory } from '@/hooks/useBookingHistory';
import { LoadingScreen } from '../LoadingScreen';
import styles from './ReturnCustomerBooking.module.css';

export const ReturnCustomerBooking = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useBookingHistory();

  const handleNewBooking = () => {
    navigate(ROUTES.BOOKING.NEW);
  };

  const handleRepeatBooking = (bookingId: string) => {
    navigate(`${ROUTES.BOOKING.REPEAT}/${bookingId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.container}
    >
      <h1 className={styles.title}>Welcome Back!</h1>
      <p className={styles.subtitle}>Choose how you'd like to proceed with your booking</p>

      <div className={styles.optionsGrid}>
        <button
          onClick={handleNewBooking}
          className={styles.optionCard}
        >
          <h2>New Booking</h2>
          <p>Start a fresh booking with new details</p>
        </button>

        {bookings.map((booking) => (
          <button
            key={booking.id}
            onClick={() => handleRepeatBooking(booking.id)}
            className={styles.optionCard}
          >
            <h2>Repeat Previous Booking</h2>
            <p>Service: {booking.serviceType}</p>
            <p>Date: {new Date(booking.scheduledAt).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ReturnCustomerBooking;
