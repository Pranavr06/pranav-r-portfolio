-- Add sort_order column to projects, certificates, and blogs tables with a default value of 0
ALTER TABLE projects ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE certificates ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE blogs ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Optional: Initial migration to keep existing sort order if desired, though everything defaulting to 0 is fine.
-- You can manually tweak these values in the UI after updating.
