-- Migration: Add size and mime_type to documents table
-- Run this in Supabase SQL Editor to add the new fields

ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS size BIGINT DEFAULT 0;

ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS mime_type TEXT DEFAULT 'application/pdf';

-- Create index on size for potential future queries
CREATE INDEX IF NOT EXISTS documents_size_idx ON documents(size);

-- Update existing records to have sensible defaults
UPDATE documents 
SET mime_type = 'application/pdf' 
WHERE mime_type IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN documents.size IS 'File size in bytes';
COMMENT ON COLUMN documents.mime_type IS 'MIME type of the uploaded file';
