-- CFC 2026 Supabase Setup Script
-- Execute this script in your Supabase SQL Editor to set up the documents and songs tables with proper RLS

-- ============================================
-- CREATE DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- Enable RLS on documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow read documents" ON documents;
DROP POLICY IF EXISTS "allow insert documents" ON documents;
DROP POLICY IF EXISTS "allow update documents" ON documents;
DROP POLICY IF EXISTS "allow delete documents" ON documents;

-- Create new RLS policies for documents (public read/write)
CREATE POLICY "allow read documents"
ON documents FOR SELECT
USING (true);

CREATE POLICY "allow insert documents"
ON documents FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow update documents"
ON documents FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "allow delete documents"
ON documents FOR DELETE
USING (true);

-- ============================================
-- CREATE SONGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'CFC 2026',
  lyrics TEXT NOT NULL,
  audio_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS songs_category_idx ON songs(category);
CREATE INDEX IF NOT EXISTS songs_created_at_idx ON songs(created_at DESC);

-- Enable RLS on songs
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow read songs" ON songs;
DROP POLICY IF EXISTS "allow insert songs" ON songs;
DROP POLICY IF EXISTS "allow update songs" ON songs;
DROP POLICY IF EXISTS "allow delete songs" ON songs;

-- Create new RLS policies for songs (public read/write)
CREATE POLICY "allow read songs"
ON songs FOR SELECT
USING (true);

CREATE POLICY "allow insert songs"
ON songs FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow update songs"
ON songs FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "allow delete songs"
ON songs FOR DELETE
USING (true);

-- ============================================
-- CREATE STORAGE BUCKET FOR DOCUMENTS
-- ============================================
-- Note: You may need to create the bucket manually in Supabase UI
-- Or run this in the Supabase Dashboard > SQL Editor:

-- Insert a documents bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set storage policies for documents bucket
CREATE POLICY "allow public read documents" 
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'authenticated_and_anonymous');

CREATE POLICY "allow public upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "allow public delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

-- ============================================
-- VERIFY SETUP
-- ============================================
-- Run these SELECT queries to verify everything is set up correctly:
-- SELECT * FROM documents;
-- SELECT * FROM songs;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
