import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/routes';
import ServiceCard from './ServiceCard';
import PremiumServiceCard from './PremiumServiceCard';
import ServiceInfoSection from './ServiceInfoSection';
import WhatsAppContactCard from './WhatsAppContactCard';
import { serviceOptions } from './servicesData';
import { premiumServices } from './premiumServicesData';
import { pageContainer, pageItem, loadingAnimation } from './pageAnimations';
import { cardContainer, cardItem } from './cardAnimations';
import styles from './PriceSelectionPage.module.css';

const PriceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleServiceSelect = (service: typeof serviceOptions[0]) => {
    // Handle special redirection cases
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

    // Handle regular services
    navigate(ROUTES.BOOKING.FIRST_TIME, {
      state: {
        selectedService: service,
        fromPriceSelection: true
      }
    });
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
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
  }

  return (
    <motion.div
      variants={pageContainer}
      initial="hidden"
      animate="show"
      className={styles.pageContainer}
    >
      <div className={styles.gradientOverlay}></div>
      <div className={styles.contentWrapper}>
        <motion.div
          variants={pageItem}
          className={styles.titleSection}
        >
          <h1 className={styles.pageTitle}>
            First Time Customer Offer
          </h1>
          <p className={styles.pageSubtitle}>
            For HDB & Condo only
          </p>
        </motion.div>
        <ServiceInfoSection />

        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className={styles.cardGrid}
        >
          {serviceOptions.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={handleServiceSelect}
            />
          ))}
          
          <WhatsAppContactCard />
        </motion.div>

        <motion.div
          variants={pageItem}
          className={styles.premiumSection}
        >
          <h2 className={styles.sectionTitle}>Premium Services</h2>
          <p className={styles.sectionSubtitle}>Professional Powerjet Wash & Specialized Services</p>
        </motion.div>

        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className={styles.cardGrid}
        >
          {premiumServices.map((service) => (
            <PremiumServiceCard
              key={service.id}
              service={service}
              onClick={handleServiceSelect}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PriceSelectionPage;
