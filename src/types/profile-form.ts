import { z } from 'zod';

/**
 * Profile form data type
 */
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unitNumber: string;
  address: string;
  condoName?: string;
  lobbyTower?: string;
}

/**
 * Profile form validation schema
 */
export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  address: z.string().min(1, 'Address is required'),
  condoName: z.string().optional(),
  lobbyTower: z.string().optional()
});

/**
 * Profile form props type
 */
export interface ProfileFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    unitNumber?: string;
    address?: string;
    condoName?: string;
    lobbyTower?: string;
  };
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Profile form errors type
 */
export type ProfileFormErrors = Partial<Record<keyof ProfileFormData, string>>;

/**
 * Profile form field type
 */
export interface ProfileFormField {
  name: keyof ProfileFormData;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}