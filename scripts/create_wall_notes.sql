-- ==============================================================================
-- Migration: Create wall_notes and wall_banned_words Tables for Community Sticky Notes (/wall)
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zsvkvxpjtirckmfvkjxd/sql
-- ==============================================================================

-- 1. Wall Notes Table
CREATE TABLE IF NOT EXISTS wall_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  message TEXT NOT NULL,
  author_name TEXT DEFAULT 'Anonymous',
  color TEXT DEFAULT 'yellow',
  emoji TEXT DEFAULT '📌',
  rotation NUMERIC DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  ip_hash TEXT,
  ip_address TEXT,
  location TEXT,
  device_info TEXT,
  user_agent TEXT
);

-- Idempotent column additions for existing tables
ALTER TABLE wall_notes ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE wall_notes ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE wall_notes ADD COLUMN IF NOT EXISTS device_info TEXT;
ALTER TABLE wall_notes ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Performance & Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_wall_notes_created_at ON wall_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wall_notes_pinned ON wall_notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_wall_notes_archived ON wall_notes(is_archived);
CREATE INDEX IF NOT EXISTS idx_wall_notes_color ON wall_notes(color);

-- Enable Row Level Security (RLS)
ALTER TABLE wall_notes ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Anyone can read active wall notes
CREATE POLICY "Public wall notes are viewable by everyone" 
ON wall_notes FOR SELECT 
USING (is_archived = false OR is_archived IS NULL);

-- 2. Public Insert Policy: Anyone can stick a note without login
CREATE POLICY "Anyone can post a wall note" 
ON wall_notes FOR INSERT 
WITH CHECK (true);

-- 3. Public Update Policy: Anyone can increment likes
CREATE POLICY "Anyone can like a wall note" 
ON wall_notes FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 4. Admin Full Access Policy
CREATE POLICY "Admins have full access to wall notes" 
ON wall_notes FOR ALL 
USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 2. Wall Banned Words Blacklist Table (Admin Configurable)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS wall_banned_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by TEXT DEFAULT 'Admin'
);

CREATE INDEX IF NOT EXISTS idx_wall_banned_words_word ON wall_banned_words(word);

ALTER TABLE wall_banned_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read banned words for server filtering" 
ON wall_banned_words FOR SELECT 
USING (true);

CREATE POLICY "Admins have full access to banned words" 
ON wall_banned_words FOR ALL 
USING (auth.role() = 'authenticated');
