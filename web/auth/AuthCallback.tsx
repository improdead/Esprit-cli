import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=auth_failed');
        return;
      }

      if (session) {
        // Check if profile exists, create if not
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Create profile for OAuth user
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: 'free',
          });
        }

        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#e8e8e8] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#ff4d00] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#666666]">Completing sign in...</p>
      </div>
    </div>
  );
}
