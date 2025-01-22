import * as z from 'zod';

/**
 * Customer form data type
 */
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  floorUnit?: string | null;
  blockStreet: string;
  postalCode: string;
  condoName?: string | null;
  lobbyTower?: string | null;
  specialInstructions?: string | null;
}

/**
 * Customer form validation schema
 */
export const customerFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(8, 'Valid phone number is required'),
  floorUnit: z.string().optional().nullable(),
  blockStreet: z.string().min(5, 'Address is required'),
  postalCode: z.string().min(6, 'Valid postal code is required'),
  condoName: z.string().optional().nullable(),
  lobbyTower: z.string().optional().nullable(),
  specialInstructions: z.string().optional().nullable()
});

/**
 * Type for form data with snake_case keys (for API compatibility)
 */
export interface DBCustomerFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  floor_unit?: string | null;
  block_street: string;
  postal_code: string;
  condo_name?: string | null;
  lobby_tower?: string | null;
  special_instructions?: string | null;
}

/**
 * Mapping functions
 */
export function mapToDBCustomerForm(data: CustomerFormData): DBCustomerFormData {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    mobile: data.mobile,
    floor_unit: data.floorUnit,
    block_street: data.blockStreet,
    postal_code: data.postalCode,
    condo_name: data.condoName,
    lobby_tower: data.lobbyTower,
    special_instructions: data.specialInstructions
  };
}

export function mapFromDBCustomerForm(data: DBCustomerFormData): CustomerFormData {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    mobile: data.mobile,
    floorUnit: data.floor_unit,
    blockStreet: data.block_street,
    postalCode: data.postal_code,
    condoName: data.condo_name,
    lobbyTower: data.lobby_tower,
    specialInstructions: data.special_instructions
  };
}