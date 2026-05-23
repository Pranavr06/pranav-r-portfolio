-- This script perfectly orders all projects based on the original legacy portfolio website
UPDATE projects SET created_at = '2026-05-23 12:00:00' WHERE title ILIKE 'College Projects%';
UPDATE projects SET created_at = '2026-05-23 11:50:00' WHERE title ILIKE 'Personal Portfolio%';
UPDATE projects SET created_at = '2026-05-23 11:40:00' WHERE title ILIKE '3D Aircraft Model%';
UPDATE projects SET created_at = '2026-05-23 11:30:00' WHERE title ILIKE 'Vaultary%';
UPDATE projects SET created_at = '2026-05-23 11:20:00' WHERE title ILIKE 'DevCollab Hub%';
UPDATE projects SET created_at = '2026-05-23 11:10:00' WHERE title ILIKE 'Sentiment Analysis AI%';
