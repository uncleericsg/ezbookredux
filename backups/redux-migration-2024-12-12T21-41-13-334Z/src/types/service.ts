export interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: string;
  scheduledTime: Date;
  location: string;
  contactNumber?: string;
  email?: string;
  notes?: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedTeam?: string;
  bookingReference: string;
  specialInstructions?: string;
  address: {
    blockStreet: string;
    floorUnit: string;
    postalCode: string;
    condoName?: string;
    lobbyTower?: string;
  };
}

export interface ServiceTeam {
  id: string;
  name: string;
  members: string[];
  availability: {
    date: Date;
    slots: string[];
  }[];
  currentAssignments: string[]; // Array of ServiceRequest IDs
}

export type ServiceStatus = ServiceRequest['status'];
