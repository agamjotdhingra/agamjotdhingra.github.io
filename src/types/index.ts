/**
 * Common shared TypeScript interfaces and types for the portfolio application.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url?: string | null;
  /** Legacy generic contact email (shown in HeroSection social links) */
  email?: string | null;
  /** College / institutional email */
  college_email?: string | null;
  /** Personal email */
  personal_email?: string | null;
  /** Phone number (digits only, e.g. "7087759597") */
  phone_number?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  updated_at?: string | null;
}

export interface Project {
  id?: string | number;
  title: string;
  description: string;
  tech_stack?: string[] | string | null;
  github_url?: string | null;
  live_url?: string | null;
  is_published?: boolean;
  /** Display order for sorting in the public portfolio (lower = shown first) */
  display_order?: number | null;
  created_at?: string;
}
