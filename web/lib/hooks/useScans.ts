import { useEffect, useState } from 'react';
import { supabase, Scan } from '../supabase';
import { useAuth } from '../auth-context';

export function useScans() {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setScans([]);
      setLoading(false);
      return;
    }

    const fetchScans = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setScans(data || []);
      }
      setLoading(false);
    };

    fetchScans();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('scans_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scans',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setScans((prev) => [payload.new as Scan, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setScans((prev) =>
              prev.map((s) => (s.id === payload.new.id ? (payload.new as Scan) : s))
            );
          } else if (payload.eventType === 'DELETE') {
            setScans((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const createScan = async (
    target: string,
    targetType: 'url' | 'repository',
    scanType: 'deep' | 'quick' | 'compliance'
  ) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        target,
        target_type: targetType,
        scan_type: scanType,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { scans, loading, error, createScan };
}

export function useRecentScans(limit: number = 6) {
  const { scans, loading, error } = useScans();
  return {
    recentScans: scans.slice(0, limit),
    loading,
    error,
  };
}
