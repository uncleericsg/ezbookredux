import type { Database } from './database';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export interface CreateTeamRequest {
  name: string;
  description?: string | null;
  isActive?: boolean;
  metadata?: Record<string, unknown> | null;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  id: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export interface CreateTeamMemberRequest {
  teamId: string;
  userId: string;
  role?: string;
  metadata?: Record<string, unknown> | null;
}

export interface UpdateTeamMemberRequest extends Partial<CreateTeamMemberRequest> {
  id: string;
}

export function mapDatabaseTeam(dbTeam: Database['public']['Tables']['teams']['Row']): Team {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: dbTeam.description,
    isActive: dbTeam.isActive,
    created_at: dbTeam.created_at,
    updated_at: dbTeam.updated_at,
    metadata: dbTeam.metadata
  };
}

export function mapTeamToDatabase(team: CreateTeamRequest): Database['public']['Tables']['teams']['Insert'] {
  return {
    name: team.name,
    description: team.description || null,
    isActive: team.isActive ?? true,
    metadata: team.metadata || null
  };
}

export function mapTeamUpdateToDatabase(team: UpdateTeamRequest): Database['public']['Tables']['teams']['Update'] {
  return {
    name: team.name,
    description: team.description,
    isActive: team.isActive,
    metadata: team.metadata
  };
}

export function mapDatabaseTeamMember(dbMember: Database['public']['Tables']['team_members']['Row']): TeamMember {
  return {
    id: dbMember.id,
    teamId: dbMember.teamId,
    userId: dbMember.userId,
    role: dbMember.role,
    created_at: dbMember.created_at,
    updated_at: dbMember.updated_at,
    metadata: dbMember.metadata
  };
}

export function mapTeamMemberToDatabase(member: CreateTeamMemberRequest): Database['public']['Tables']['team_members']['Insert'] {
  return {
    teamId: member.teamId,
    userId: member.userId,
    role: member.role || 'member',
    metadata: member.metadata || null
  };
}

export function mapTeamMemberUpdateToDatabase(member: UpdateTeamMemberRequest): Database['public']['Tables']['team_members']['Update'] {
  return {
    teamId: member.teamId,
    userId: member.userId,
    role: member.role,
    metadata: member.metadata
  };
} 