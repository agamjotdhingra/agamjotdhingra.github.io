/**
 * Common shared TypeScript interfaces and types for the portfolio application.
 */

export interface NavItem {
  label: string;
  href: string;
}

export type ContentStatus = 'draft' | 'published';

export type EngineeringDomain = 'electronics' | 'software' | 'ai';

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

export interface ProjectArchitecture {
  problem: string;
  systemDesign: string;
  keyDecisions: string[];
  techChoices: { tech: string; reason: string }[];
  lessonsLearned: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
}

export interface Project {
  id?: string | number;
  title: string;
  slug?: string;
  description: string;
  domain?: EngineeringDomain;
  tech_stack?: string[] | string | null;
  github_url?: string | null;
  live_url?: string | null;
  is_published?: boolean;
  display_order?: number | null;
  created_at?: string;
  architecture?: ProjectArchitecture;
}

export interface GitHubActivityItem {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  message?: string;
  date: string;
}

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  learning_status: string; // e.g. 'Planning' | 'In Progress' | 'Completed' | 'Studying'
  description: string;
  detailed_notes: string;
  status: ContentStatus;
  created_at?: string;
  updated_at?: string;
}

export interface NotebookEntry {
  id: string;
  title: string;
  slug: string;
  category: string;
  publication_date: string;
  reading_time: string;
  description: string;
  content: string;
  status: ContentStatus;
  created_at?: string;
  updated_at?: string;
}
