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

const PriceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleServiceSelect = (service: typeof serviceOptions[0]) => {
    navigate(ROUTES.BOOKING.FIRST_TIME, { 
      state: { 
        selectedService: service,
        fromPriceSelection: true 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tl from-[#0c001a] via-gray-900 to-gray-800 relative flex items-center justify-center">
        <motion.div
          className="w-32 h-32 rounded-xl bg-gradient-to-r from-sky-900/40 to-blue-900/40 backdrop-blur-sm border border-sky-500/30 shadow-lg"
          animate={loadingAnimation}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageContainer}
      initial="hidden"
      animate="show"
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tl from-[#0c001a] via-gray-900 to-gray-800 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/20 via-transparent to-blue-400/5"></div>
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={pageItem}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">
            First Time Customer Offer
          </h1>
          <p className="text-gray-200 text-lg">
            For HDB & Condo only
          </p>
        </motion.div>
        <ServiceInfoSection />

        <motion.div
          variants={pageItem}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mt-12"
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
          className="col-span-full text-center mt-12 mb-8"
        >
          <h2 className="text-3xl font-bold text-[#FFD700] mb-2">Premium Services</h2>
          <p className="text-gray-400">Professional Powerjet Wash & Specialized Services</p>
        </motion.div>

        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
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
