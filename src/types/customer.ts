/**
 * Customer address type
 */
export interface CustomerAddress {
  blockStreet: string;
  floorUnit?: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  region: string; // Region for service area
}

/**
 * Customer info type
 */
export interface CustomerInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: CustomerAddress;
  specialInstructions?: string;
}

/**
 * Available regions
 */
export type Region = 'central' | 'north' | 'south' | 'east' | 'west';

/**
 * Region details
 */
export interface RegionDetails {
  id: Region;
  name: string;
  description: string;
  postalCodes: string[];
}
