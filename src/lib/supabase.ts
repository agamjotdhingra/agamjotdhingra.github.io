import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clean up whitespace, enclosing quotes, or accidental placeholder brackets
const supabaseUrl = typeof rawUrl === 'string'
  ? rawUrl.trim().replace(/^["']|["']$/g, '').replace(/[<>]/g, '')
  : undefined;

const supabaseAnonKey = typeof rawKey === 'string'
  ? rawKey.trim().replace(/^["']|["']$/g, '')
  : undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
