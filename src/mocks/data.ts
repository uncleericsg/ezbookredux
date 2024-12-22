import type { UserProfile, MembershipTier, Address } from '../types/user';
import type { TechnicianProfile, TechnicianSchedule } from '../types/technician';

// Mock Addresses
export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    unitNumber: '#12-34',
    blockStreet: '123 Orchard Road',
    postalCode: '238858',
    condoName: 'The Luxe',
    lobbyTower: 'Tower A',
    isDefault: true
  },
  {
    id: 'addr-2',
    unitNumber: '#05-67',
    blockStreet: '456 Marina Bay Drive',
    postalCode: '018987',
    condoName: 'Marina View',
    lobbyTower: 'Tower B',
    isDefault: false
  }
];

// Mock Users
export const mockUsers: UserProfile[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    membershipTier: 'REGULAR',
    createdAt: '2024-01-01T00:00:00Z',
    phone: '+65 9123 4567',
    addresses: [mockAddresses[0]]
  },
  {
    id: 'user-2',
    email: 'jane.amc@example.com',
    firstName: 'Jane',
    lastName: 'AMC',
    membershipTier: 'AMC',
    createdAt: '2024-01-02T00:00:00Z',
    phone: '+65 9876 5432',
    addresses: [mockAddresses[1]]
  }
];

// Mock Admin Data
export const mockAdminData = {
  totalUsers: 150,
  activeBookings: 25,
  pendingBookings: 10,
  completedBookings: 100,
  recentActivities: [
    {
      id: 'act-1',
      type: 'booking_created',
      userId: 'user-1',
      timestamp: '2024-01-20T10:00:00Z'
    },
    {
      id: 'act-2',
      type: 'user_registered',
      userId: 'user-2',
      timestamp: '2024-01-19T15:30:00Z'
    }
  ]
};

// Mock Technicians
export const mockTechnicians: TechnicianProfile[] = [
  {
    id: 'tech-1',
    email: 'alex.tech@iaircon.com',
    firstName: 'Alex',
    lastName: 'Lee',
    phone: '+65 9111 2222',
    level: 'SENIOR',
    status: 'AVAILABLE',
    serviceAreas: ['CENTRAL', 'EAST'],
    rating: 4.8,
    totalJobs: 250,
    completedJobs: 245,
    specializations: ['Maintenance', 'Repair', 'Installation'],
    certifications: ['Certified AC Technician', 'Safety First Aid'],
    availability: {
      startTime: '09:00:00Z',
      endTime: '18:00:00Z',
      daysOff: [0] // Sunday off
    },
    currentLocation: {
      latitude: 1.3521,
      longitude: 103.8198,
      lastUpdated: '2024-01-21T10:00:00Z'
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 'tech-2',
    email: 'sarah.tech@iaircon.com',
    firstName: 'Sarah',
    lastName: 'Tan',
    phone: '+65 9333 4444',
    level: 'MASTER',
    status: 'BUSY',
    serviceAreas: ['NORTH', 'CENTRAL'],
    rating: 4.9,
    totalJobs: 500,
    completedJobs: 498,
    specializations: ['Commercial AC', 'Industrial AC', 'Smart AC Systems'],
    certifications: ['Master AC Technician', 'Industrial Safety', 'Smart Home Expert'],
    availability: {
      startTime: '08:00:00Z',
      endTime: '17:00:00Z',
      daysOff: [6] // Saturday off
    },
    currentLocation: {
      latitude: 1.3644,
      longitude: 103.9915,
      lastUpdated: '2024-01-21T10:00:00Z'
    },
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  }
];

// Mock Technician Schedules
export const mockSchedules: TechnicianSchedule[] = [
  {
    id: 'schedule-1',
    technicianId: 'tech-1',
    bookingId: 'booking-1',
    status: 'PENDING',
    scheduledStartTime: '2024-01-21T14:00:00Z',
    scheduledEndTime: '2024-01-21T16:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'schedule-2',
    technicianId: 'tech-2',
    bookingId: 'booking-2',
    status: 'ON_SITE',
    scheduledStartTime: '2024-01-21T09:00:00Z',
    scheduledEndTime: '2024-01-21T11:00:00Z',
    actualStartTime: '2024-01-21T09:15:00Z',
    notes: 'Customer requested additional service check',
    createdAt: '2024-01-19T15:00:00Z',
    updatedAt: '2024-01-21T09:15:00Z'
  }
];

// Initial Auth State
export const mockAuthState = {
  isAuthenticated: true,
  token: 'mock-jwt-token',
  loading: false,
  error: null
};

// Initial User State
export const mockUserState = {
  currentUser: mockUsers[0],
  loading: false,
  error: null,
  paymentStatus: 'idle' as const
};

// Initial Admin State
export const mockAdminState = {
  isAdmin: true,
  adminData: mockAdminData,
  loading: false,
  error: null
};

// Initial Technician State
export const mockTechnicianState = {
  currentTechnician: mockTechnicians[0],
  technicians: mockTechnicians,
  schedules: mockSchedules,
  loading: false,
  error: null
};
