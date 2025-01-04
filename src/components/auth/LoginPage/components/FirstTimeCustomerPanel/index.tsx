import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getStyle, cn } from '../../styles/common';
import { ActionButton } from '../common';
import type { FirstTimeCustomerPanelProps } from '../../types';

/**
 * Panel for first-time customers with action buttons
 */
export const FirstTimeCustomerPanel: React.FC<FirstTimeCustomerPanelProps> = ({
  className
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        getStyle('panels', 'firstTime'),
        getStyle('containers', 'panel'),
        className
      )}
    >
      <h2 className={cn(
        getStyle('text', 'title'),
        'mb-3'
      )}>
        First Time Customer
      </h2>
      
      <p className={cn(
        getStyle('text', 'subtitle'),
        'mb-4'
      )}>
        Experience hassle-free air conditioning services with our easy booking system.
      </p>

      <div className={getStyle('utils', 'spaceY')}>
        <ActionButton
          animate
          variant="primary"
          onClick={() => navigate('/booking/price-selection', { 
            state: { isFirstTimeCustomer: true } 
          })}
          icon={<ArrowRight />}
        >
          Enjoy First Time Customer Offer
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={() => navigate('/')}
          icon={<ArrowRight />}
        >
          Browse All Services
        </ActionButton>

        <ActionButton
          variant="accent"
          onClick={() => navigate('/amc/signup')}
          icon={<ArrowRight />}
        >
          Sign up for AMC Package
        </ActionButton>
      </div>
    </motion.div>
  );
};

export default FirstTimeCustomerPanel;