import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import styles from './QuickBookingPrompt.module.css';

export const QuickBookingPrompt = () => {
  const navigate = useNavigate();

  const handleQuickBook = () => {
    navigate(ROUTES.BOOKING.QUICK);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <h2>Quick Booking</h2>
      <p>Need service right away? Book a quick appointment now.</p>
      <button onClick={handleQuickBook} className={styles.quickBookButton}>
        Book Now
      </button>
    </motion.div>
  );
};
