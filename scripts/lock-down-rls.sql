-- Run ONCE in the Supabase SQL editor, AFTER the deploy that moves admin API
-- routes to the service-role key (lib/supabase-admin.ts). Running it before
-- that deploy breaks saving in the admin panel.
--
-- Removes the policies that let anyone holding the public anon key edit content.
-- Public read access is unchanged.

DROP POLICY IF EXISTS "Allow anonymous write" ON site_content;
DROP POLICY IF EXISTS "Allow anonymous write" ON highlights;
DROP POLICY IF EXISTS "Allow anonymous write" ON courses;
DROP POLICY IF EXISTS "Allow anonymous write" ON research_experiences;
DROP POLICY IF EXISTS "Allow anonymous write" ON community_service;
DROP POLICY IF EXISTS "Allow anonymous write" ON activities;
DROP POLICY IF EXISTS "Allow anonymous write" ON gallery_images;
DROP POLICY IF EXISTS "Allow anonymous write" ON testimonials;
DROP POLICY IF EXISTS "Allow anonymous write" ON youtube_videos;

-- Check: this should list only "Allow anonymous read" policies.
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
