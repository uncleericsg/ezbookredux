export interface TeamMember {
    id: string;
    name: string;
    role: string;
}

export interface TeamStats {
    totalJobs: number;
    completedJobs: number;
    pendingJobs: number;
    serviceTypes: {
        [key: string]: number; // e.g., { "AIRCON_SERVICE": 10, "AIRCON_REPAIR": 5 }
    };
    rating: number;
    lastJobDate?: string;
}

export interface Team {
    id: string;
    name: string;
    active: boolean;
    members?: TeamMember[];
    stats?: TeamStats;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeamAssignment {
    id: string;
    bookingId: string;
    teamId: string;
    assignedAt: string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    manuallyAssigned: boolean;
    serviceType: string;
}

// Mock data for development
export const MOCK_TEAMS: Team[] = [
    {
        id: 'team-a',
        name: 'Team A',
        active: true,
        members: [
            {
                id: 'member-1',
                name: 'John Leader',
                role: 'leader'
            }
        ],
        stats: {
            totalJobs: 150,
            completedJobs: 145,
            pendingJobs: 5,
            serviceTypes: {
                'AIRCON_SERVICE': 80,
                'AIRCON_REPAIR': 50,
                'AIRCON_INSTALLATION': 20
            },
            rating: 4.8,
            lastJobDate: new Date().toISOString()
        }
    },
    {
        id: 'team-b',
        name: 'Team B',
        active: true,
        members: [
            {
                id: 'member-2',
                name: 'Sarah Leader',
                role: 'leader'
            }
        ],
        stats: {
            totalJobs: 120,
            completedJobs: 118,
            pendingJobs: 2,
            serviceTypes: {
                'AIRCON_SERVICE': 60,
                'AIRCON_REPAIR': 45,
                'AIRCON_INSTALLATION': 15
            },
            rating: 4.9,
            lastJobDate: new Date().toISOString()
        }
    }
];
