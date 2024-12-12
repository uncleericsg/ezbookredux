export type MembershipTier = 'REGULAR' | 'AMC';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: MembershipTier;
  createdAt: string; // ISO date string
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  unitNumber: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  isDefault: boolean;
}

export const determineMembershipTier = (lastName: string): MembershipTier => {
  return lastName.toUpperCase().includes('AMC') ? 'AMC' : 'REGULAR';
};
