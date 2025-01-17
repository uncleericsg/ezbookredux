import { supabaseClient } from '@/config/supabase/client';
import { handleValidationError } from '@/utils/apiErrors';
import type { SocialLinks } from '@/types/social';

export async function getSocialLinks(userId: string): Promise<SocialLinks> {
  const { data, error } = await supabaseClient
    .from('social_links')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data || { userId, links: {} };
}

export async function updateSocialLinks(
  userId: string,
  links: Record<string, string>
): Promise<SocialLinks> {
  // Validate URLs
  Object.entries(links).forEach(([platform, url]) => {
    if (url && !isValidUrl(url)) {
      handleValidationError(`Invalid URL for ${platform}`);
    }
  });

  const { data, error } = await supabaseClient
    .from('social_links')
    .upsert({ user_id: userId, links })
    .select()
    .single();

  if (error) throw error;
  return data;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}