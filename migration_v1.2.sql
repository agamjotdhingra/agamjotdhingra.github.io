-- =============================================================================
-- Portfolio v1.2 — Database Migration: Notebook & Explorations CMS
-- Target: public.notebook_entries and public.explorations tables
-- Author: Agamjot Singh Dhingra
-- Admin UUID: 855f8ee7-54e7-4137-b86a-ad6e1bc53f96
--
-- Security Model:
--   1. Public visitors (anonymous and non-admin) can ONLY read records where
--      status = 'published'.
--   2. Draft access, record creation, updates, and deletion are EXCLUSIVELY
--      restricted to the verified administrator via auth.uid().
--   3. Unrestricted authenticated-user access is completely removed.
--   4. Preserves all existing profile and projects tables, data, and policies.
--
-- Safety: Idempotent — safe to execute multiple times in Supabase SQL Editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- STEP 1: Create public.notebook_entries Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notebook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Engineering',
  publication_date TEXT NOT NULL,
  reading_time TEXT NOT NULL DEFAULT '5 min read',
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optimize queries filtering by status and ordered by date
CREATE INDEX IF NOT EXISTS idx_notebook_entries_status_created
  ON public.notebook_entries (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- STEP 2: Create public.explorations Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.explorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Engineering',
  learning_status TEXT NOT NULL DEFAULT 'Studying',
  description TEXT NOT NULL DEFAULT '',
  detailed_notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optimize queries filtering by status and ordered by date
CREATE INDEX IF NOT EXISTS idx_explorations_status_created
  ON public.explorations (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- STEP 3: Enable Row Level Security (RLS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.notebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explorations ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- STEP 4: Notebook CMS RLS Policies
-- ---------------------------------------------------------------------------

-- Public: Can ONLY read published articles (anonymously or authenticated)
DROP POLICY IF EXISTS "Public can view published notebook entries" ON public.notebook_entries;
DROP POLICY IF EXISTS "Public can read published notebook entries" ON public.notebook_entries;
CREATE POLICY "Public can view published notebook entries"
  ON public.notebook_entries
  FOR SELECT
  USING (status = 'published');

-- Admin: Exclusive full access (draft reads, insert, update, delete)
DROP POLICY IF EXISTS "Admins have full access to notebook entries" ON public.notebook_entries;
DROP POLICY IF EXISTS "Admin exclusive full access to notebook entries" ON public.notebook_entries;
CREATE POLICY "Admin exclusive full access to notebook entries"
  ON public.notebook_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = '855f8ee7-54e7-4137-b86a-ad6e1bc53f96'::uuid)
  WITH CHECK (auth.uid() = '855f8ee7-54e7-4137-b86a-ad6e1bc53f96'::uuid);

-- ---------------------------------------------------------------------------
-- STEP 5: Explorations CMS RLS Policies
-- ---------------------------------------------------------------------------

-- Public: Can ONLY read published explorations
DROP POLICY IF EXISTS "Public can view published explorations" ON public.explorations;
DROP POLICY IF EXISTS "Public can read published explorations" ON public.explorations;
CREATE POLICY "Public can view published explorations"
  ON public.explorations
  FOR SELECT
  USING (status = 'published');

-- Admin: Exclusive full access (draft reads, insert, update, delete)
DROP POLICY IF EXISTS "Admins have full access to explorations" ON public.explorations;
DROP POLICY IF EXISTS "Admin exclusive full access to explorations" ON public.explorations;
CREATE POLICY "Admin exclusive full access to explorations"
  ON public.explorations
  FOR ALL
  TO authenticated
  USING (auth.uid() = '855f8ee7-54e7-4137-b86a-ad6e1bc53f96'::uuid)
  WITH CHECK (auth.uid() = '855f8ee7-54e7-4137-b86a-ad6e1bc53f96'::uuid);

-- ---------------------------------------------------------------------------
-- STEP 6: Verification Queries (Review output in Supabase SQL Editor)
-- ---------------------------------------------------------------------------
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('notebook_entries', 'explorations')
ORDER BY tablename, policyname;
