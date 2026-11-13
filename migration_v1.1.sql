-- =============================================================================
-- Portfolio v1.1 — Database Migration
-- Target: public.profile table
-- Author: Agamjot Dhingra
-- Purpose: Add college_email, personal_email, phone_number columns;
--          populate contact data; add display_order to public.projects.
-- Safety: Idempotent — safe to run multiple times. No destructive SQL.
-- DO NOT run this in production without reviewing the SELECT verification
-- queries at the bottom first.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- STEP 1: Extend public.profile with new contact columns
-- Uses IF NOT EXISTS equivalent via DO blocks to remain idempotent.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profile'
      AND column_name = 'college_email'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN college_email TEXT;
    RAISE NOTICE 'Added column: college_email';
  ELSE
    RAISE NOTICE 'Column college_email already exists, skipping.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profile'
      AND column_name = 'personal_email'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN personal_email TEXT;
    RAISE NOTICE 'Added column: personal_email';
  ELSE
    RAISE NOTICE 'Column personal_email already exists, skipping.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profile'
      AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN phone_number TEXT;
    RAISE NOTICE 'Added column: phone_number';
  ELSE
    RAISE NOTICE 'Column phone_number already exists, skipping.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- STEP 2: Add display_order column to public.projects (for ordering)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'projects'
      AND column_name = 'display_order'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN display_order INTEGER DEFAULT 0;
    RAISE NOTICE 'Added column: display_order to projects';
  ELSE
    RAISE NOTICE 'Column display_order already exists in projects, skipping.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- STEP 3: Populate profile record (id = 1) with verified identity & contact info.
-- ---------------------------------------------------------------------------

UPDATE public.profile
SET
  full_name      = 'Agamjot Singh Dhingra',
  headline       = 'Electronics and Computer Engineering Student | Exploring Software, Electronics & AI',
  bio            = 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence. I enjoy learning new technologies, experimenting with ideas and building practical projects. This portfolio documents my learning journey, projects and technical growth.',
  college_email  = COALESCE(college_email,  'adhingra_be25@thapar.edu'),
  personal_email = COALESCE(personal_email, 'agamjotsdhingra@gmail.com'),
  phone_number   = COALESCE(phone_number,   '7087759597'),
  github_url     = COALESCE(github_url,     'https://github.com/agamjotdhingra'),
  linkedin_url   = COALESCE(linkedin_url,   'https://www.linkedin.com/in/agamjot-singh-dhingra-3216b7293/'),
  updated_at     = NOW()
WHERE id = 1;

-- ---------------------------------------------------------------------------
-- STEP 4: Migrate existing generic email → personal_email (if applicable).
-- If the existing `email` column holds a personal email and personal_email
-- is not yet set, migrate it. Then optionally clear `email` if redundant.
-- This block is safe — it only acts when personal_email is still NULL after
-- step 3 (meaning the COALESCE above already populated it, so this is a no-op
-- in most cases).
-- ---------------------------------------------------------------------------

-- Note: We keep the `email` column untouched to preserve backward compatibility
-- with the existing HeroSection which renders a mailto from `email`.
-- The admin can clear or repurpose it via the Profile Editor.

-- ---------------------------------------------------------------------------
-- STEP 5: Verification queries — review these results after running
-- ---------------------------------------------------------------------------

-- Check profile columns were added:
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profile'
ORDER BY ordinal_position;

-- Check profile data for id = 1:
SELECT
  id,
  full_name,
  email,
  college_email,
  personal_email,
  phone_number,
  github_url,
  linkedin_url,
  updated_at
FROM public.profile
WHERE id = 1;

-- Check projects column was added:
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'projects'
  AND column_name = 'display_order';

