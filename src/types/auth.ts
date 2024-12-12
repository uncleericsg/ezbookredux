// @integration-point Firebase Auth types
export interface FirebaseUser {
  uid: string;
  phoneNumber: string | null;
  emailVerified?: boolean;
}

// @integration-point Supabase Data types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  addresses: Address[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  name: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  isDefault?: boolean;
}

// Combined user type for the application
export interface User extends Partial<FirebaseUser>, Partial<UserProfile> {
  // Common required fields regardless of auth provider
  id: string;  // This could be Firebase UID or Supabase ID
}
