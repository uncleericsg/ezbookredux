export interface TeamMember {
    id: string;
    name: string;
    active: boolean;
}

export interface Team {
    id: string;
    name: string;  // e.g., "Team A", "Team B"
    members: TeamMember[];
    active: boolean;
}

export interface TeamAssignment {
    bookingId: string;
    teamId: string;
    assignedAt: string;
    manuallyAssigned: boolean;
}
