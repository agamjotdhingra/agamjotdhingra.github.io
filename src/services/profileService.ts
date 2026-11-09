import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types';

export interface FetchProfileResult {
  profile: Profile | null;
  error: string | null;
}

/**
 * Fetches the single profile record where id = 1 from public.profile.
 * Strictly read-only. Uses the existing anon-key Supabase client.
 * Includes extended contact fields added in migration v1.1.
 */
export async function getProfile(): Promise<FetchProfileResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      profile: null,
      error: 'Supabase client is not configured. Please verify your environment variables.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('profile')
      .select(
        'id, full_name, headline, bio, avatar_url, email, college_email, personal_email, phone_number, github_url, linkedin_url, updated_at'
      )
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      return {
        profile: null,
        error: error.message || 'Failed to fetch profile from Supabase.',
      };
    }

    return {
      profile: (data as Profile) || null,
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred while fetching profile.';
    return {
      profile: null,
      error: message,
    };
  }
}
