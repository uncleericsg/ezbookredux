import type { Database } from './supabase';
import type { User, UserProfile } from './user';

export type SupabaseUser = Database['public']['Tables']['users']['Row'];
export type SupabaseProfile = Database['public']['Tables']['profiles']['Row'];

export function convertSupabaseUser(user: SupabaseUser): User {
  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? null,
    last_sign_in_at: user.last_sign_in_at ?? null,
    role: 'user',
    status: 'active',
    profile: null
  };
}

export function convertSupabaseProfile(profile: SupabaseProfile): UserProfile {
  return {
    id: profile.id,
    user_id: profile.user_id,
    full_name: profile.full_name ?? null,
    avatar_url: profile.avatar_url ?? null,
    bio: profile.bio ?? null,
    website: profile.website ?? null
  };
}