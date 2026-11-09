import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Project } from '@/types';

export interface FetchProjectsResult {
  projects: Project[];
  error: string | null;
}

/**
 * Fetches all published projects from the Supabase public.projects table.
 * Adheres to:
 * - is_published = true filter
 * - ordered by display_order (ascending), then created_at (descending) as tiebreaker
 * - requested fields: title, description, tech_stack, github_url, live_url, display_order
 */
export async function getPublishedProjects(): Promise<FetchProjectsResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      projects: [],
      error: 'Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, tech_stack, github_url, live_url, is_published, display_order')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return {
        projects: [],
        error: error.message || 'Failed to fetch projects from Supabase.',
      };
    }

    return {
      projects: (data as Project[]) || [],
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred while fetching projects.';
    return {
      projects: [],
      error: message,
    };
  }
}
