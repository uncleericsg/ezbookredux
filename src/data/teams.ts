import { Team } from '../types/teams';

export const mockTeams: Team[] = [
    {
        id: '1',
        name: 'Alpha Team',
        active: true,
        members: [
            { id: '1', name: 'John Doe', role: 'Team Lead' },
            { id: '2', name: 'Jane Smith', role: 'Technician' },
            { id: '3', name: 'Mike Johnson', role: 'Assistant' }
        ],
        stats: {
            totalJobs: 150,
            completedJobs: 142,
            pendingJobs: 8,
            rating: 4.8,
            lastJobDate: '2024-01-15',
            serviceTypes: {
                AIRCON_SERVICE: 85,
                AIRCON_REPAIR: 45,
                AIRCON_INSTALLATION: 20
            }
        }
    },
    {
        id: '2',
        name: 'Beta Team',
        active: true,
        members: [
            { id: '4', name: 'Sarah Wilson', role: 'Team Lead' },
            { id: '5', name: 'Tom Brown', role: 'Technician' }
        ],
        stats: {
            totalJobs: 120,
            completedJobs: 115,
            pendingJobs: 5,
            rating: 4.6,
            lastJobDate: '2024-01-14',
            serviceTypes: {
                AIRCON_SERVICE: 70,
                AIRCON_REPAIR: 35,
                AIRCON_INSTALLATION: 15
            }
        }
    },
    {
        id: '3',
        name: 'Gamma Team',
        active: false,
        members: [
            { id: '6', name: 'David Lee', role: 'Team Lead' },
            { id: '7', name: 'Emma Davis', role: 'Technician' },
            { id: '8', name: 'Chris Taylor', role: 'Assistant' }
        ],
        stats: {
            totalJobs: 95,
            completedJobs: 90,
            pendingJobs: 5,
            rating: 4.7,
            lastJobDate: '2024-01-13',
            serviceTypes: {
                AIRCON_SERVICE: 55,
                AIRCON_REPAIR: 25,
                AIRCON_INSTALLATION: 15
            }
        }
    },
    {
        id: '4',
        name: 'Delta Team',
        active: true,
        members: [
            { id: '9', name: 'Alex Chen', role: 'Team Lead' },
            { id: '10', name: 'Rachel Kim', role: 'Technician' }
        ],
        stats: {
            totalJobs: 80,
            completedJobs: 75,
            pendingJobs: 5,
            rating: 4.9,
            lastJobDate: '2024-01-12',
            serviceTypes: {
                AIRCON_SERVICE: 45,
                AIRCON_REPAIR: 20,
                AIRCON_INSTALLATION: 15
            }
        }
    }
];
