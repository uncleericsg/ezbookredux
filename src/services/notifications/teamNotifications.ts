import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError } from '@/utils/apiErrors';
import type { Team } from '@/types/team';
import type { Notification } from '@/types/notifications';

export class TeamNotificationService {
  constructor() {
    this.sendAdminDashboardNotification = this.sendAdminDashboardNotification.bind(this);
    this.sendTeamEmail = this.sendTeamEmail.bind(this);
  }

  async notifyTeam(team: Team, notification: Notification): Promise<void> {
    logger.info('Sending team notification', { teamId: team.id });

    try {
      await Promise.all([
        this.sendAdminDashboardNotification(team, notification),
        this.sendTeamEmail(team, notification)
      ]);
    } catch (error) {
      logger.error('Failed to send team notification', {
        message: error instanceof Error ? error.message : String(error),
        details: { teamId: team.id }
      });
      throw error;
    }
  }

  private async sendAdminDashboardNotification(team: Team, notification: Notification): Promise<void> {
    logger.info('Sending admin dashboard notification', { teamId: team.id });

    const { error } = await supabaseClient
      .from('notifications')
      .insert({
        team_id: team.id,
        type: notification.type,
        message: notification.message,
        metadata: notification.metadata
      });

    if (error) {
      logger.error('Failed to send admin dashboard notification', {
        message: error.message,
        details: { teamId: team.id }
      });
      throw error;
    }
  }

  private async sendTeamEmail(team: Team, notification: Notification): Promise<void> {
    logger.info('Sending team email', { teamId: team.id });

    const emailContent = {
      subject: notification.subject,
      body: notification.message,
      metadata: notification.metadata
    };

    const { error } = await supabaseClient
      .from('emails')
      .insert({
        team_id: team.id,
        content: emailContent,
        status: 'pending'
      });

    if (error) {
      logger.error('Failed to send team email', {
        message: error.message,
        details: { teamId: team.id }
      });
      throw error;
    }
  }
}
