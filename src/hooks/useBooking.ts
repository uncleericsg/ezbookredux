import { useState } from 'react';
import { TeamAssignmentService } from '../services/teams/teamAssignment';
import { db } from '../lib/db';

interface BookingData {
    date: string;
    serviceId: string;
    customerId: string;
    // Add other booking fields as needed
}

interface BookingResponse {
    id: string;
    date: string;
    status: string;
    // other public booking fields...
}

export const useBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const teamAssignmentService = new TeamAssignmentService();

    const notifyTeamAssignment = async (booking: any, team: any) => {
        // Implement internal notification logic here
    };

    const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
        setLoading(true);
        setError(null);

        try {
            // Create the booking first
            const booking = await db.bookings.create({
                data: bookingData
            });

            // Internally assign team without exposing to public
            const team = await teamAssignmentService.getNextAvailableTeam(
                bookingData.date
            );

            if (team) {
                await teamAssignmentService.createTeamAssignment({
                    bookingId: booking.id,
                    teamId: team.id,
                    assignedAt: new Date().toISOString(),
                    manuallyAssigned: false
                });

                // Send internal notification to admin/staff
                await notifyTeamAssignment(booking, team);
            }

            // Return only booking info to public, not team assignment
            return {
                id: booking.id,
                date: booking.date,
                status: 'confirmed',
                // other public booking fields...
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getBookingTeam = async (bookingId: string) => {
        try {
            return await teamAssignmentService.getTeamForBooking(bookingId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get booking team');
            return null;
        }
    };

    return {
        createBooking,
        getBookingTeam,
        loading,
        error
    };
};
