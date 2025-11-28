import { useState, useEffect, useCallback } from 'react';
import { supabase, LinkedRepo } from '../supabase';
import { useAuth } from '../auth-context';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  default_branch: string;
  private: boolean;
}

export function useGitHub() {
  const { user, profile, refreshProfile } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [linkedRepos, setLinkedRepos] = useState<LinkedRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!profile?.github_access_token;

  // Fetch linked repos from Supabase
  const fetchLinkedRepos = useCallback(async () => {
    if (!user) return;

    const { data, error: fetchError } = await supabase
      .from('linked_repos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching linked repos:', fetchError);
      return;
    }

    setLinkedRepos(data || []);
  }, [user]);

  // Fetch GitHub repos using access token
  const fetchGitHubRepos = useCallback(async () => {
    if (!profile?.github_access_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `Bearer ${profile.github_access_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('GitHub token expired. Please reconnect.');
          return;
        }
        throw new Error('Failed to fetch repos');
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repos');
    } finally {
      setLoading(false);
    }
  }, [profile?.github_access_token]);

  // Connect to GitHub via OAuth
  const connectGitHub = useCallback(async () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      setError('GitHub OAuth not configured');
      return;
    }

    // Generate state for CSRF protection
    const state = crypto.randomUUID();
    localStorage.setItem('github_oauth_state', state);

    // Redirect to GitHub OAuth
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'repo read:user';
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

    window.location.href = url;
  }, []);

  // Disconnect from GitHub
  const disconnectGitHub = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          github_username: null,
          github_access_token: null,
          github_connected_at: null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Remove all linked repos
      await supabase
        .from('linked_repos')
        .delete()
        .eq('user_id', user.id);

      setRepos([]);
      setLinkedRepos([]);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile]);

  // Link a repo
  const linkRepo = useCallback(async (repo: GitHubRepo) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('linked_repos')
        .upsert({
          user_id: user.id,
          provider: 'github',
          repo_full_name: repo.full_name,
          repo_name: repo.name,
          repo_owner: repo.owner.login,
          repo_url: repo.html_url,
          default_branch: repo.default_branch,
          is_private: repo.private,
        });

      if (insertError) throw insertError;

      await fetchLinkedRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link repo');
    } finally {
      setLoading(false);
    }
  }, [user, fetchLinkedRepos]);

  // Unlink a repo
  const unlinkRepo = useCallback(async (repoId: string) => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('linked_repos')
        .delete()
        .eq('id', repoId);

      if (deleteError) throw deleteError;

      await fetchLinkedRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink repo');
    } finally {
      setLoading(false);
    }
  }, [fetchLinkedRepos]);

  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchLinkedRepos();
    }
  }, [user, fetchLinkedRepos]);

  useEffect(() => {
    if (isConnected) {
      fetchGitHubRepos();
    }
  }, [isConnected, fetchGitHubRepos]);

  return {
    isConnected,
    repos,
    linkedRepos,
    loading,
    error,
    connectGitHub,
    disconnectGitHub,
    linkRepo,
    unlinkRepo,
    fetchGitHubRepos,
    fetchLinkedRepos,
  };
}
