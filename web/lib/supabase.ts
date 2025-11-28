import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'team';
  stripe_customer_id?: string;
  github_username?: string;
  github_access_token?: string;
  github_connected_at?: string;
  created_at: string;
}

export interface LinkedRepo {
  id: string;
  user_id: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  repo_full_name: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  default_branch: string;
  is_private: boolean;
  last_scanned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  target: string;
  target_type: 'url' | 'repository';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scan_type: 'deep' | 'quick' | 'compliance';
  started_at?: string;
  completed_at?: string;
  sandbox_id?: string;
  report_url?: string;
  repo_id?: string;
  repo_branch?: string;
  repo_commit_sha?: string;
  vulnerabilities_found?: number;
  critical_count?: number;
  high_count?: number;
  medium_count?: number;
  low_count?: number;
  created_at: string;
}

export interface ScanLog {
  id: string;
  scan_id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  metadata: Record<string, unknown>;
}

export interface Usage {
  id: string;
  user_id: string;
  month: string;
  scans_count: number;
  tokens_used: number;
}
