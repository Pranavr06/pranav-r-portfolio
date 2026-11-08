-- ==============================================================================
-- Migration: Add GitHub & Page Settings Attributes to experience_hubs
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zsvkvxpjtirckmfvkjxd/sql
-- ==============================================================================

-- 1. Add GitHub & Page Settings columns to experience_hubs table
ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS github_username TEXT DEFAULT 'Pranavr06';

ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com/Pranavr06';

ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT 'Technologies & Architecture I Use in Production';

ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS focus_text TEXT DEFAULT 'Core Focus: Scalable Full-Stack Architectures & Secure Systems';

ALTER TABLE experience_hubs 
ADD COLUMN IF NOT EXISTS show_github_graph BOOLEAN DEFAULT true;

-- 2. Populate Technical Expertise hub with default values
UPDATE experience_hubs
SET 
  github_username = 'Pranavr06',
  github_url = 'https://github.com/Pranavr06',
  subtitle = 'Technologies & Architecture I Use in Production',
  focus_text = 'Core Focus: Scalable Full-Stack Architectures & Secure Systems',
  show_github_graph = true
WHERE href = '/experiences/technical-expertise' OR title = 'Technical Expertise';
