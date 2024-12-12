import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServicePricingSelection from '../ServicePricingSelection';
import type { PricingOption } from '../../types/booking';

const ReturnCustomerPricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePricingSelect = (service: PricingOption) => {
    console.log('[DEBUG] ReturnCustomerPricingPage - Price selected:', service);
    // Navigate to details page with the selected service
    navigate('/booking/return-customer/details', { 
      state: { selectedService: service }
    });
  };

  return (
    <div className="w-full">
      <ServicePricingSelection onSelect={handlePricingSelect} />
    </div>
  );
};

export default ReturnCustomerPricingPage;
