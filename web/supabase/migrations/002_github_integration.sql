-- GitHub Integration Migration
-- Adds support for GitHub repo scanning

-- Add GitHub columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_access_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_connected_at TIMESTAMPTZ;

-- Create linked_repos table for saved GitHub repos
CREATE TABLE IF NOT EXISTS linked_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'github', -- github, gitlab, bitbucket
  repo_full_name TEXT NOT NULL, -- e.g., "owner/repo"
  repo_name TEXT NOT NULL,
  repo_owner TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  is_private BOOLEAN DEFAULT false,
  last_scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, repo_full_name)
);

-- Update scans table to support GitHub repos
ALTER TABLE scans ADD COLUMN IF NOT EXISTS repo_id UUID REFERENCES linked_repos(id);
ALTER TABLE scans ADD COLUMN IF NOT EXISTS repo_branch TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS repo_commit_sha TEXT;

-- Add scan_logs table for real-time updates
CREATE TABLE IF NOT EXISTS scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  level TEXT DEFAULT 'info', -- info, warning, error, success
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_linked_repos_user ON linked_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scan ON scan_logs(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_timestamp ON scan_logs(scan_id, timestamp DESC);

-- RLS policies for linked_repos
ALTER TABLE linked_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own repos" ON linked_repos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repos" ON linked_repos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repos" ON linked_repos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own repos" ON linked_repos
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for scan_logs
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan logs" ON scan_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scans WHERE scans.id = scan_logs.scan_id AND scans.user_id = auth.uid()
    )
  );

-- Service role can insert scan logs
CREATE POLICY "Service can insert scan logs" ON scan_logs
  FOR INSERT WITH CHECK (true);

-- Enable realtime for scan_logs
ALTER PUBLICATION supabase_realtime ADD TABLE scan_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE scans;

-- Function to add scan log
CREATE OR REPLACE FUNCTION add_scan_log(
  p_scan_id UUID,
  p_level TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO scan_logs (scan_id, level, message, metadata)
  VALUES (p_scan_id, p_level, p_message, p_metadata)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
