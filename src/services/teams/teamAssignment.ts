import { Team, TeamAssignment } from './types';
import { db } from '../../lib/db';  // Assuming you have a db setup

export class TeamAssignmentService {
    // Get active teams
    private async getActiveTeams(): Promise<Team[]> {
        return await db.teams.findMany({
            where: { active: true }
        });
    }

    // Get team assignments for a specific day
    private async getTeamAssignmentsForDay(date: string): Promise<TeamAssignment[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await db.teamAssignments.findMany({
            where: {
                assignedAt: {
                    gte: startOfDay.toISOString(),
                    lte: endOfDay.toISOString()
                }
            }
        });
    }

    // Get next available team using round-robin
    async getNextAvailableTeam(bookingDate: string): Promise<Team | null> {
        const activeTeams = await this.getActiveTeams();
        if (activeTeams.length === 0) return null;

        // Get team assignments for the day
        const dayAssignments = await this.getTeamAssignmentsForDay(bookingDate);
        
        // Find team with least assignments
        return activeTeams.reduce((leastBusyTeam, currentTeam) => {
            const currentTeamAssignments = dayAssignments.filter(
                assignment => assignment.teamId === currentTeam.id
            ).length;
            
            const leastBusyAssignments = dayAssignments.filter(
                assignment => assignment.teamId === leastBusyTeam.id
            ).length;

            return currentTeamAssignments < leastBusyAssignments ? 
                   currentTeam : leastBusyTeam;
        });
    }

    // Create a new team assignment
    async createTeamAssignment(assignment: TeamAssignment): Promise<TeamAssignment> {
        return await db.teamAssignments.create({
            data: assignment
        });
    }

    // Manual override assignment
    async assignTeamManually(bookingId: string, teamId: string): Promise<void> {
        await this.createTeamAssignment({
            bookingId,
            teamId,
            assignedAt: new Date().toISOString(),
            manuallyAssigned: true
        });
    }

    // Get team assignment for a booking
    async getTeamForBooking(bookingId: string): Promise<Team | null> {
        const assignment = await db.teamAssignments.findFirst({
            where: { bookingId }
        });

        if (!assignment) return null;

        return await db.teams.findUnique({
            where: { id: assignment.teamId }
        });
    }
}
