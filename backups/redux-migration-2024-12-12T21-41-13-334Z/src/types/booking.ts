export interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

export interface SavedLocation {
  id: string;
  address: string;
  postalCode: string;
  unitNumber: string;
  default: boolean;
}

export interface SavedDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locations: SavedLocation[];
}

export interface CustomerInfo {
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
