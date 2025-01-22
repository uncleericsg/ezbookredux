/**
 * AMC Package type definition
 */
export interface AMCPackage {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  visits: ServiceVisit[];
  type: 'standard' | 'premium';
  price: number;
  renewalDate?: string;
}

/**
 * Service Visit type definition
 */
export interface ServiceVisit {
  id: string;
  date: string;
  label: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  technicianId?: string;
  packageId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Renewal Status type definition
 */
export interface RenewalStatus {
  shouldRemind: boolean;
  isLastVisit: boolean;
}

/**
 * AMC Service Error Codes
 */
export type AMCErrorCode = 
  | 'RENEWAL_FAILED'
  | 'FETCH_VISITS_FAILED'
  | 'INVALID_PACKAGE'
  | 'PACKAGE_EXPIRED';