import { Team, TeamMember } from './types';
import { db } from '../../lib/db';

export const teamManagement = {
    // Team CRUD operations
    async createTeam(name: string): Promise<Team> {
        return await db.teams.create({
            data: {
                name,
                active: true,
                members: []
            }
        });
    },

    async getTeam(teamId: string): Promise<Team | null> {
        return await db.teams.findUnique({
            where: { id: teamId }
        });
    },

    async getAllTeams(): Promise<Team[]> {
        return await db.teams.findMany();
    },

    async updateTeam(teamId: string, data: Partial<Team>): Promise<Team> {
        return await db.teams.update({
            where: { id: teamId },
            data
        });
    },

    async deleteTeam(teamId: string): Promise<void> {
        await db.teams.delete({
            where: { id: teamId }
        });
    },

    // Team member management
    async addTeamMember(teamId: string, member: TeamMember): Promise<Team> {
        const team = await this.getTeam(teamId);
        if (!team) throw new Error('Team not found');

        return await db.teams.update({
            where: { id: teamId },
            data: {
                members: [...team.members, member]
            }
        });
    },

    async removeTeamMember(teamId: string, memberId: string): Promise<Team> {
        const team = await this.getTeam(teamId);
        if (!team) throw new Error('Team not found');

        return await db.teams.update({
            where: { id: teamId },
            data: {
                members: team.members.filter(m => m.id !== memberId)
            }
        });
    },

    async updateTeamMember(
        teamId: string,
        memberId: string,
        updates: Partial<TeamMember>
    ): Promise<Team> {
        const team = await this.getTeam(teamId);
        if (!team) throw new Error('Team not found');

        return await db.teams.update({
            where: { id: teamId },
            data: {
                members: team.members.map(m => 
                    m.id === memberId ? { ...m, ...updates } : m
                )
            }
        });
    },

    // Team status management
    async setTeamStatus(teamId: string, active: boolean): Promise<Team> {
        return await db.teams.update({
            where: { id: teamId },
            data: { active }
        });
    },

    // Manual assignment override
    async reassignBooking(bookingId: string, newTeamId: string): Promise<void> {
        await db.teamAssignments.update({
            where: { bookingId },
            data: {
                teamId: newTeamId,
                manuallyAssigned: true,
                assignedAt: new Date().toISOString()
            }
        });
    }
};
