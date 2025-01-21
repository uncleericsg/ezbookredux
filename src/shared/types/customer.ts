export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  specialInstructions?: string;
}

export interface CustomerAddress {
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
}

export interface CustomerContact {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface CustomerPreferences {
  specialInstructions?: string;
  preferredLanguage?: string;
  communicationPreferences?: string[];
}

export interface Customer {
  id: string;
  contact: CustomerContact;
  address: CustomerAddress;
  preferences?: CustomerPreferences;
  createdAt: string;
  updatedAt: string;
} 