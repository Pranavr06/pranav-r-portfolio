-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Completed', 'In Progress', 'Collection')),
  demo_url TEXT,
  repo_url TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- Create certificates table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  issuer TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT
);

-- Create blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time_minutes INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Create contacts table (for form submissions)
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

-- Set up Row Level Security (RLS)
-- Allow public read access to projects, certificates, and blogs
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON projects FOR SELECT USING (true);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public certificates are viewable by everyone." ON certificates FOR SELECT USING (true);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public blogs are viewable by everyone." ON blogs FOR SELECT USING (true);

-- Allow public to insert into contacts, but not read them
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact form" ON contacts FOR INSERT WITH CHECK (true);

-- To allow Admin (authenticated users) full access to all tables:
CREATE POLICY "Admins have full access to projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
