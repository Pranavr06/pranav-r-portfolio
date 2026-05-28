-- Add new columns to existing contacts table
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS purpose TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS source_page TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT,
ADD COLUMN IF NOT EXISTS source_slug TEXT,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_starred BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ip_hash TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create indexes for admin performance
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_archived ON contacts(is_archived);
CREATE INDEX IF NOT EXISTS idx_contacts_starred ON contacts(is_starred);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_source_type ON contacts(source_type);
CREATE INDEX IF NOT EXISTS idx_contacts_purpose ON contacts(purpose);
