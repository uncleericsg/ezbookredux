import { z } from 'zod';

/**
 * Address type
 */
export interface Address {
  id: string;
  address: string;
  unitNumber: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  isPrimary: boolean;
}

/**
 * Address form data type
 */
export interface AddressFormData {
  address: string;
  unitNumber: string;
  postalCode: string;
  condoName: string;
  lobbyTower: string;
}

/**
 * Address form errors type
 */
export type AddressFormErrors = Partial<Record<keyof AddressFormData, string>>;

/**
 * Address validation schema
 */
export const addressFormSchema = z.object({
  address: z.string().min(1, 'Block/Number with Street Address is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  postalCode: z.string().min(6, 'Valid postal code required').max(6),
  condoName: z.string().optional(),
  lobbyTower: z.string().optional()
});

/**
 * Initial form data
 */
export const initialAddressFormData: AddressFormData = {
  address: '',
  unitNumber: '',
  postalCode: '',
  condoName: '',
  lobbyTower: ''
};

/**
 * Address manager props type
 */
export interface AddressManagerProps {
  onAddressChange?: (addresses: Address[]) => void;
  className?: string;
}