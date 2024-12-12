// Branded Types
export type PhoneNumber = string;
export type PostalCode = string & { __brand: 'PostalCode' };

// Validation Types
export type ValidationResult<T> = {
  isValid: boolean;
  errors?: Record<keyof T, string>;
  formatted?: T;
};

// Address Types
export type AddressFormat = 'unit' | 'block' | 'street' | 'full';
export type UnitFormat = 'hash' | 'dash' | 'slash';

export interface AddressComponents {
  block: string;
  street: string;
  unitNumber?: string;
  postalCode: PostalCode;
  level?: string;
  buildingName?: string;
}

// Form Data Types
export interface FormattedAddress {
  short: string;
  full: string;
  components: AddressComponents;
}

// Constants
export const ADDRESS_CONSTRAINTS = {
  block: { minLength: 1, maxLength: 5 },
  street: { minLength: 2, maxLength: 100 },
  unitNumber: { minLength: 1, maxLength: 10 },
  postalCode: { length: 6 },
  level: { minLength: 1, maxLength: 3 },
  buildingName: { minLength: 2, maxLength: 100 }
} as const;

export const PHONE_CONSTRAINTS = {
  validPrefixes: ['6', '8', '9']
} as const;
