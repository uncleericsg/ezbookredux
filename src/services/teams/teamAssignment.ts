import { supabaseClient } from '@/config/supabase/client';
import { handleNotFoundError } from '@/utils/apiErrors';
import type { TeamMember } from '@/types/team';

export async function assignTeamMember(
  teamId: string,
  userId: string,
  role: string
): Promise<TeamMember> {
  const { data, error } = await supabaseClient
    .from('team_members')
    .insert({
      teamId,
      userId,
      role
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw handleNotFoundError('Failed to assign team member');

  return data;
}

export async function unassignTeamMember(
  teamId: string,
  userId: string
): Promise<void> {
  const { error } = await supabaseClient
    .from('team_members')
    .delete()
    .match({ teamId, userId });

  if (error) throw error;
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const { data, error } = await supabaseClient
    .from('team_members')
    .select('*')
    .eq('teamId', teamId);

  if (error) throw error;
  return data || [];
}
