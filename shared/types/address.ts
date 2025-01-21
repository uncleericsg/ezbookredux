/**
 * Address types for the application
 */

/**
 * Base address interface
 */
export interface Address {
  id: string;
  user_id: string;
  block_street: string;
  floor_unit: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
  is_default: boolean;
  is_verified: boolean;
  google_place_id?: string;
  formatted_address?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Request to create a new address
 */
export interface CreateAddressRequest {
  block_street: string;
  floor_unit: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
  is_default?: boolean;
  google_place_id?: string;
  formatted_address?: string;
}

/**
 * Request to update an existing address
 */
export interface UpdateAddressRequest {
  block_street?: string;
  floor_unit?: string;
  postal_code?: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
  is_default?: boolean;
  is_verified?: boolean;
  google_place_id?: string;
  formatted_address?: string;
}

/**
 * Address validation result
 */
export interface AddressValidation {
  isValid: boolean;
  errors?: {
    block_street?: string[];
    floor_unit?: string[];
    postal_code?: string[];
    general?: string[];
  };
}

/**
 * Address geocoding result
 */
export interface AddressGeocode {
  latitude: number;
  longitude: number;
  formatted_address: string;
  place_id: string;
  components: {
    street_number?: string;
    route?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
}

/**
 * Address service error
 */
export interface AddressError {
  code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'SERVER_ERROR';
  message: string;
  details?: unknown;
}
