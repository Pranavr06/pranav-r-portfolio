-- ==============================================================================
-- Migration: Add 'tags' Attribute to Certificates, Projects & Experiences
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zsvkvxpjtirckmfvkjxd/sql
-- ==============================================================================

-- 1. Ensure 'tags' text[] array column exists on certificates
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 2. Ensure 'tags' text[] array column exists on projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 3. Ensure 'tags' text[] array column exists on experiences (safety check)
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 4. Ensure 'tags' text[] array column exists on experience_hubs (safety check)
ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 5. Backfill tags from existing skills / tech_stack where available
UPDATE certificates 
SET tags = skills 
WHERE tags IS NULL AND skills IS NOT NULL;

UPDATE projects 
SET tags = tech_stack 
WHERE tags IS NULL AND tech_stack IS NOT NULL;

-- 6. Add GIN indexes for rapid tag-based filtering and searches
CREATE INDEX IF NOT EXISTS idx_certificates_tags ON certificates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_experiences_tags ON experiences USING GIN(tags);
