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

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/routes';
import EmptyState from '../common/EmptyState';
const ServiceCard = React.lazy(() => import('./ServiceCard'));
const PremiumServiceCard = React.lazy(() => import('./PremiumServiceCard'));
const ServiceInfoSection = React.lazy(() => import('./ServiceInfoSection'));
const WhatsAppContactCard = React.lazy(() => import('./WhatsAppContactCard'));
import useServiceData from '../../hooks/useServiceData';
import usePremiumServiceData from '../../hooks/usePremiumServiceData';
import { pageContainer, pageItem, loadingAnimation } from './pageAnimations';
import { cardContainer, cardItem } from './cardAnimations';
import styles from './PriceSelectionPage.module.css';

const LoadingSpinner = () => (
  <div className={styles.loadingContainer}>
    <motion.div
      className={styles.loadingSpinner}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
);

const PriceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { services, isLoading: isServicesLoading, error: servicesError } = useServiceData();
  const { premiumServices, isLoading: isPremiumLoading, error: premiumError } = usePremiumServiceData();
  
  const isLoading = isServicesLoading || isPremiumLoading;

  const handleServiceSelect = (service: typeof services[0]) => {
    if (service.id === "powerjet-chemical") {
      navigate(ROUTES.BOOKING.POWERJET_CHEMICAL);
      window.scrollTo(0, 0);
      return;
    }
    if (service.id === "gas-leakage") {
      navigate(ROUTES.BOOKING.GAS_LEAK);
      window.scrollTo(0, 0);
      return;
    }

    navigate(ROUTES.BOOKING.FIRST_TIME, {
      state: {
        selectedService: service,
        fromPriceSelection: true
      }
    });
    window.scrollTo(0, 0);
  };

  if (servicesError || premiumError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error loading services</h2>
        <p>{servicesError?.message || premiumError?.message}</p>
      </div>
    );
  }

  if (services.length === 0 && premiumServices.length === 0 && !isLoading) {
    return (
      <EmptyState
        title="No Services Available"
        description="We're currently unable to load our service options. Please try again later."
      />
    );
  }

  if (isLoading) {
    return (
      <motion.div
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={styles.loadingSpinner}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageContainer}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.pageContainer}
    >
      <div className={styles.gradientOverlay}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleSection}>
          <motion.h1
            className={styles.pageTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            First Time Customer Offer
          </motion.h1>
          <motion.p
            className={styles.pageSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            For HDB & Condo only
          </motion.p>
        </div>
        <ServiceInfoSection />

        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className={styles.cardGrid}
        >
          {services.map((service) => (
            <Suspense fallback={<LoadingSpinner />}>
              <ServiceCard
                key={service.id}
                service={service}
                onClick={handleServiceSelect}
              />
            </Suspense>
          ))}
          
          <Suspense fallback={<LoadingSpinner />}>
            <WhatsAppContactCard />
          </Suspense>
        </motion.div>

        <div className={styles.premiumSection}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium Services
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional Powerjet Wash & Specialized Services
          </motion.p>
        </div>

        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className={styles.cardGrid}
        >
          {premiumServices.map((service) => (
            <Suspense fallback={<LoadingSpinner />}>
              <PremiumServiceCard
                key={service.id}
                service={service}
                onClick={handleServiceSelect}
              />
            </Suspense>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PriceSelectionPage;
