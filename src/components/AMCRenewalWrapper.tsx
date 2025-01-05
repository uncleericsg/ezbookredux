import React from 'react';
import AMCRenewal from './AMCRenewal';

/**
 * Wrapper component to handle AMCRenewal props
 */
const AMCRenewalWrapper: React.FC = () => {
  // Mock packages data - in real app this would come from an API or store
  const mockPackages = [
    {
      id: '1',
      name: 'Basic AMC',
      price: 299,
      description: 'Basic maintenance package'
    },
    {
      id: '2',
      name: 'Premium AMC',
      price: 499,
      description: 'Premium maintenance package'
    }
  ];

  // Mock async selection handler
  const handleSelect = async (packageId: string): Promise<void> => {
    console.log('Selected package:', packageId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <AMCRenewal
      packages={mockPackages}
      onSelect={handleSelect}
    />
  );
};

export default AMCRenewalWrapper;