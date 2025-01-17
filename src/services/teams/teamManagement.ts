import { supabaseClient } from '@/config/supabase/client';
import { handleNotFoundError } from '@/utils/apiErrors';
import type { Team, CreateTeamRequest, UpdateTeamRequest } from '@/types/team';
import { mapTeamToDatabase, mapTeamUpdateToDatabase, mapDatabaseTeam } from '@/types/team';

export async function createTeam(data: CreateTeamRequest): Promise<Team> {
  const { data: team, error } = await supabaseClient
    .from('teams')
    .insert(mapTeamToDatabase(data))
    .select()
    .single();

  if (error) throw error;
  if (!team) throw handleNotFoundError('Failed to create team');

  return mapDatabaseTeam(team);
}

export async function updateTeam(id: string, data: UpdateTeamRequest): Promise<Team> {
  const { data: team, error } = await supabaseClient
    .from('teams')
    .update(mapTeamUpdateToDatabase(data))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!team) throw handleNotFoundError('Team not found');

  return mapDatabaseTeam(team);
}

export async function getTeam(id: string): Promise<Team> {
  const { data: team, error } = await supabaseClient
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!team) throw handleNotFoundError('Team not found');

  return mapDatabaseTeam(team);
}

export async function listTeams(): Promise<Team[]> {
  const { data: teams, error } = await supabaseClient
    .from('teams')
    .select('*')
    .order('name');

  if (error) throw error;
  return (teams || []).map(mapDatabaseTeam);
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabaseClient
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
