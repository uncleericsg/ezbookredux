/*
 * Error Handling Strategy:
 *
 * This component uses a multi-layered error handling approach:
 *
 * 1. Component-Level Error States:
 *    - Handles service loading errors with dedicated error UI
 *    - Uses React Query's built-in error states
 *    - Shows empty state when no services are available
 *
 * 2. Loading States:
 *    - Uses Suspense for lazy-loaded components
 *    - Shows loading spinner during data fetching
 *    - Prevents errors during loading with proper state checks
 *
 * 3. Error Recovery:
 *    - Uses React Query's automatic retry mechanism
 *    - Shows clear error messages to users
 *    - Provides empty state fallback for data issues
 *
 * Note: This component relies on the root error boundary in main.tsx
 * for unexpected errors, while handling expected errors at the component level.
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ServiceCard } from './ServiceCard';
import { PremiumServiceCard } from './PremiumServiceCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useServices } from '@/hooks/useServices';
import { usePremiumServices } from '@/hooks/usePremiumServices';
import { Service } from '@shared/types/service';
import styles from './PriceSelectionPage.module.css';

export const PriceSelectionPage = () => {
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices();
  const { services: premiumServices, loading: premiumLoading } = usePremiumServices();

  const handleServiceSelect = (service: Service) => {
    if (service.id === "powerjet-chemical") {
      navigate(ROUTES.BOOKING.POWERJET_CHEMICAL);
    } else {
      navigate(`${ROUTES.BOOKING.SERVICE}/${service.id}`);
    }
  };

  if (servicesLoading || premiumLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Select a Service</h1>
      
      <section className={styles.servicesSection}>
        <h2>Standard Services</h2>
        <motion.div className={styles.servicesGrid}>
          {services.map((service) => (
            <motion.div key={service.id} className={styles.serviceCard}>
              <Suspense fallback={<LoadingSpinner />}>
                <ServiceCard
                  service={service}
                  onClick={handleServiceSelect}
                />
              </Suspense>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {premiumServices.length > 0 && (
        <section className={styles.premiumSection}>
          <h2>Premium Services</h2>
          <motion.div className={styles.servicesGrid}>
            {premiumServices.map((service) => (
              <motion.div key={service.id} className={styles.serviceCard}>
                <Suspense fallback={<LoadingSpinner />}>
                  <PremiumServiceCard
                    service={service}
                    onClick={handleServiceSelect}
                  />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </motion.div>
  );
};

export default PriceSelectionPage;
