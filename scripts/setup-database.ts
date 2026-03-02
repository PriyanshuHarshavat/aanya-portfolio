/**
 * Database Setup Script
 * Creates all tables in Supabase
 */

import { Client } from 'pg'

const connectionString = `postgresql://postgres:vdwmUde6odFqZgCC@db.iifoawvkiuonkkvgaxpd.supabase.co:5432/postgres`

const schema = `
-- Table 1: site_content (key-value for simple fields)
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: highlights (about section stats)
CREATE TABLE IF NOT EXISTS highlights (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Table 3: courses (academic journey)
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  semester TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Table 4: research_experiences
CREATE TABLE IF NOT EXISTS research_experiences (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  project_title TEXT NOT NULL,
  duration TEXT,
  period TEXT,
  description TEXT,
  outcomes TEXT[],
  skills TEXT[],
  sort_order INT DEFAULT 0
);

-- Table 5: community_service
CREATE TABLE IF NOT EXISTS community_service (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  category_icon TEXT,
  category_color TEXT,
  organization TEXT NOT NULL,
  role TEXT,
  period TEXT,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- Table 6: activities (sports, arts, clubs)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  category TEXT NOT NULL,
  category_icon TEXT,
  category_color TEXT,
  name TEXT NOT NULL,
  description TEXT,
  period TEXT,
  highlight TEXT,
  sort_order INT DEFAULT 0
);

-- Table 7: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  category TEXT DEFAULT 'book',
  sort_order INT DEFAULT 0
);

-- Table 8: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT,
  sort_order INT DEFAULT 0
);

-- Table 9: youtube_videos
CREATE TABLE IF NOT EXISTS youtube_videos (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (drop if exists first)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read" ON site_content;
  DROP POLICY IF EXISTS "Allow anonymous write" ON site_content;
  DROP POLICY IF EXISTS "Allow anonymous read" ON highlights;
  DROP POLICY IF EXISTS "Allow anonymous write" ON highlights;
  DROP POLICY IF EXISTS "Allow anonymous read" ON courses;
  DROP POLICY IF EXISTS "Allow anonymous write" ON courses;
  DROP POLICY IF EXISTS "Allow anonymous read" ON research_experiences;
  DROP POLICY IF EXISTS "Allow anonymous write" ON research_experiences;
  DROP POLICY IF EXISTS "Allow anonymous read" ON community_service;
  DROP POLICY IF EXISTS "Allow anonymous write" ON community_service;
  DROP POLICY IF EXISTS "Allow anonymous read" ON activities;
  DROP POLICY IF EXISTS "Allow anonymous write" ON activities;
  DROP POLICY IF EXISTS "Allow anonymous read" ON gallery_images;
  DROP POLICY IF EXISTS "Allow anonymous write" ON gallery_images;
  DROP POLICY IF EXISTS "Allow anonymous read" ON testimonials;
  DROP POLICY IF EXISTS "Allow anonymous write" ON testimonials;
  DROP POLICY IF EXISTS "Allow anonymous read" ON youtube_videos;
  DROP POLICY IF EXISTS "Allow anonymous write" ON youtube_videos;
END $$;

CREATE POLICY "Allow anonymous read" ON site_content FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON site_content FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON highlights FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON highlights FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON courses FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON research_experiences FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON research_experiences FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON community_service FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON community_service FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON activities FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON gallery_images FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write" ON youtube_videos FOR ALL USING (true);
`

async function main() {
  console.log('🚀 Connecting to database...')

  const client = new Client({ connectionString })

  try {
    await client.connect()
    console.log('✓ Connected')

    console.log('📦 Creating tables...')
    await client.query(schema)
    console.log('✓ Tables created')

    console.log('\n✅ Database setup complete!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
