export interface Address {
  id: string;
  user_id: string;
  block_street: string;
  floor_unit: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

export interface CreateAddressRequest {
  block_street: string;
  floor_unit: string;
  postal_code: string;
  is_default?: boolean;
}

export interface UpdateAddressRequest {
  block_street?: string;
  floor_unit?: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface AddressResponse {
  id: string;
  block_street: string;
  floor_unit: string;
  postal_code: string;
  is_default: boolean;
} 