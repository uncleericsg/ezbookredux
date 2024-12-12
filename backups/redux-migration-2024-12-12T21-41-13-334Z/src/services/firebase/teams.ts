import { db } from '../firebase';
import { Team, TeamMember, TeamAssignment, MOCK_TEAMS } from '../../types/teams';

export const teamsService = {
    // Team Operations
    async getTeams(): Promise<Team[]> {
        if (process.env.NODE_ENV === 'development') {
            return MOCK_TEAMS;
        }

        const teamsSnapshot = await db.collection('teams').get();
        return teamsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Team));
    },

    async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
        if (process.env.NODE_ENV === 'development') {
            const newTeam: Team = {
                ...teamData,
                id: `team-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            MOCK_TEAMS.push(newTeam);
            return newTeam;
        }

        const teamRef = await db.collection('teams').add({
            ...teamData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return {
            ...teamData,
            id: teamRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    },

    async updateTeam(teamId: string, updates: Partial<Team>): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            const index = MOCK_TEAMS.findIndex(t => t.id === teamId);
            if (index !== -1) {
                MOCK_TEAMS[index] = {
                    ...MOCK_TEAMS[index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
            }
            return;
        }

        await db.collection('teams').doc(teamId).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
    },

    async deleteTeam(teamId: string): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            const index = MOCK_TEAMS.findIndex(t => t.id === teamId);
            if (index !== -1) {
                MOCK_TEAMS.splice(index, 1);
            }
            return;
        }

        await db.collection('teams').doc(teamId).delete();
    },

    // Team Member Operations
    async addTeamMember(teamId: string, member: Omit<TeamMember, 'id' | 'joinedAt'>): Promise<TeamMember> {
        const newMember: TeamMember = {
            ...member,
            id: `member-${Date.now()}`,
            joinedAt: new Date().toISOString()
        };

        if (process.env.NODE_ENV === 'development') {
            const team = MOCK_TEAMS.find(t => t.id === teamId);
            if (team) {
                team.members.push(newMember);
            }
            return newMember;
        }

        await db.collection('teams').doc(teamId).update({
            members: db.FieldValue.arrayUnion(newMember)
        });

        return newMember;
    },

    async removeTeamMember(teamId: string, memberId: string): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            const team = MOCK_TEAMS.find(t => t.id === teamId);
            if (team) {
                team.members = team.members.filter(m => m.id !== memberId);
            }
            return;
        }

        const team = await db.collection('teams').doc(teamId).get();
        const members = (team.data()?.members || []) as TeamMember[];
        const updatedMembers = members.filter(m => m.id !== memberId);

        await db.collection('teams').doc(teamId).update({
            members: updatedMembers
        });
    },

    // Team Assignment Operations
    async createAssignment(assignment: Omit<TeamAssignment, 'id'>): Promise<TeamAssignment> {
        const newAssignment: TeamAssignment = {
            ...assignment,
            id: `assignment-${Date.now()}`
        };

        if (process.env.NODE_ENV === 'development') {
            return newAssignment;
        }

        await db.collection('teamAssignments').add(newAssignment);
        return newAssignment;
    },

    async getTeamAssignments(teamId: string, date: string): Promise<TeamAssignment[]> {
        if (process.env.NODE_ENV === 'development') {
            return [];
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const assignmentsSnapshot = await db.collection('teamAssignments')
            .where('teamId', '==', teamId)
            .where('assignedAt', '>=', startOfDay.toISOString())
            .where('assignedAt', '<=', endOfDay.toISOString())
            .get();

        return assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TeamAssignment));
    }
};
