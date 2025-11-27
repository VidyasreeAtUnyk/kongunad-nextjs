-- Form Submissions Table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('appointment', 'checkup', 'research', 'job')),
  form_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
-- GIN index on entire form_data JSONB for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_data ON form_submissions USING GIN (form_data);
-- Text index for email search (using text pattern matching)
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions ((form_data->>'email') text_pattern_ops);

-- Composite indexes for common filter combinations (optimize for 200+ submissions)
CREATE INDEX IF NOT EXISTS idx_form_submissions_type_status ON form_submissions(form_type, status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type_created_at ON form_submissions(form_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status_created_at ON form_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type_status_created_at ON form_submissions(form_type, status, created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to insert (for API routes)
CREATE POLICY "Allow service role to insert submissions"
  ON form_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow service role to read all submissions
CREATE POLICY "Allow service role to read submissions"
  ON form_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Allow service role to update submissions
CREATE POLICY "Allow service role to update submissions"
  ON form_submissions
  FOR UPDATE
  TO service_role
  USING (true);

-- Note: In production, you may want to restrict these policies further
-- For now, service_role has full access (which is fine for server-side API routes)

