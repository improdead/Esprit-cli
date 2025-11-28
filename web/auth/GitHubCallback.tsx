import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('github_oauth_state');

      // Verify state for CSRF protection
      if (!state || state !== storedState) {
        setError('Invalid state parameter. Please try again.');
        return;
      }
      localStorage.removeItem('github_oauth_state');

      if (!code) {
        setError('No authorization code received.');
        return;
      }

      if (!user) {
        setError('You must be logged in to connect GitHub.');
        return;
      }

      setStatus('Exchanging code for access token...');

      try {
        // Exchange code for token via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/github/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || 'Failed to exchange code');
        }

        const { access_token, username } = await response.json();

        setStatus('Saving GitHub connection...');

        // Save to profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            github_access_token: access_token,
            github_username: username,
            github_connected_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        await refreshProfile();

        setStatus('Connected! Redirecting...');
        setTimeout(() => navigate('/dashboard/pentest'), 1000);
      } catch (err) {
        console.error('GitHub callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect GitHub');
      }
    };

    handleCallback();
  }, [searchParams, user, navigate, refreshProfile]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="max-w-md w-full p-6 bg-zinc-900 rounded-lg border border-red-500/50">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-white">Connection Failed</h2>
            <p className="mt-2 text-zinc-400">{error}</p>
            <button
              onClick={() => navigate('/dashboard/pentest')}
              className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full p-6 bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-white">Connecting GitHub</h2>
          <p className="mt-2 text-zinc-400">{status}</p>
        </div>
      </div>
    </div>
  );
}
