-- ==============================================================================
-- Migration: Add Tracking Attributes to activity_logs table
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zsvkvxpjtirckmfvkjxd/sql
-- ==============================================================================

-- 1. Add dedicated tracking columns if they don't already exist
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS details JSONB;

-- 2. Create indexes for rapid search, filtering, and admin queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_email ON activity_logs(email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_ip ON activity_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON activity_logs(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 3. Backfill email and ip_address from existing description JSON where available
UPDATE activity_logs
SET 
  email = COALESCE(email, (description::jsonb -> 'meta' ->> 'email')),
  status = COALESCE(status, CASE 
    WHEN action = 'attempt_recorded' THEN 'warning'
    WHEN action = 'lockout_triggered' THEN 'blocked'
    WHEN action = 'success' THEN 'success'
    ELSE 'info'
  END),
  details = COALESCE(details, description::jsonb)
WHERE description IS NOT NULL 
  AND description LIKE '{%'
  AND (email IS NULL OR details IS NULL);
