import { Team } from '@services/teams/types';

interface BookingNotification {
    bookingId: string;
    date: string;
    location: string;
    serviceType: string;
    customerName: string;
    // other relevant booking details
}

export const teamNotifications = {
    async notifyTeamAssignment(booking: BookingNotification, team: Team) {
        // Send internal notification to admin dashboard
        await this.sendAdminDashboardNotification(booking, team);
        
        // Send email to team leader/admin
        await this.sendTeamEmail(booking, team);
    },

    private async sendAdminDashboardNotification(booking: BookingNotification, team: Team) {
        // Implementation for admin dashboard notification
        // This could be through WebSocket, internal API, etc.
        await db.notifications.create({
            data: {
                type: 'TEAM_ASSIGNMENT',
                title: `New Booking Assigned to ${team.name}`,
                content: `Booking #${booking.bookingId} for ${booking.customerName} on ${booking.date} has been assigned to ${team.name}`,
                status: 'unread',
                teamId: team.id,
                bookingId: booking.bookingId,
                createdAt: new Date().toISOString()
            }
        });
    },

    private async sendTeamEmail(booking: BookingNotification, team: Team) {
        // Implementation for sending email to team leader/admin
        // This could use your email service of choice
        const emailContent = `
            New booking assigned to ${team.name}
            
            Booking Details:
            - Booking ID: ${booking.bookingId}
            - Date: ${booking.date}
            - Location: ${booking.location}
            - Service: ${booking.serviceType}
            - Customer: ${booking.customerName}
        `;

        // Send email using your email service
        // await emailService.send({
        //     to: team.leaderEmail,
        //     subject: `New Booking Assignment - ${booking.bookingId}`,
        //     content: emailContent
        // });
    }
};
