interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

interface SavedLocation {
  id: string;
  address: string;
  postalCode: string;
  unitNumber: string;
  default: boolean;
}

interface SavedDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locations: SavedLocation[];
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  selectedAddressId: string;
  address: {
    address: string;
    postalCode: string;
    unitNumber: string;
  };
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  isAMC?: boolean;
}

// Export all types
export type {
  PricingOption,
  SavedLocation,
  SavedDetails,
  CustomerInfo,
  TimeSlot
};
