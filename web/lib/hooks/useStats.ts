import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth-context';

interface DashboardStats {
  totalVulnerabilities: number;
  criticalIssues: number;
  activeScans: number;
  remediated: number;
  // Percentage changes (mock for now, would need historical data)
  totalChange: number;
  criticalChange: number;
  remediatedChange: number;
}

export function useStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVulnerabilities: 0,
    criticalIssues: 0,
    activeScans: 0,
    remediated: 0,
    totalChange: 0,
    criticalChange: 0,
    remediatedChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get all scans to calculate stats
        const { data: scans, error: scansError } = await supabase
          .from('scans')
          .select('*')
          .eq('user_id', user.id);

        if (scansError) throw scansError;

        // Get vulnerabilities
        const { data: vulnerabilities, error: vulnError } = await supabase
          .from('vulnerabilities')
          .select('*')
          .eq('user_id', user.id);

        if (vulnError) throw vulnError;

        // Calculate stats
        const totalVulns = vulnerabilities?.length || 0;
        const criticalVulns = vulnerabilities?.filter((v) => v.severity === 'critical').length || 0;
        const activeScans = scans?.filter((s) => s.status === 'running' || s.status === 'pending').length || 0;
        const remediated = vulnerabilities?.filter((v) => v.status === 'remediated').length || 0;

        setStats({
          totalVulnerabilities: totalVulns,
          criticalIssues: criticalVulns,
          activeScans,
          remediated,
          // Mock percentage changes - would need historical data for real values
          totalChange: totalVulns > 0 ? 12 : 0,
          criticalChange: criticalVulns > 0 ? -5 : 0,
          remediatedChange: remediated > 0 ? 18 : 0,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription
    const subscription = supabase
      .channel('stats_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scans', filter: `user_id=eq.${user.id}` },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vulnerabilities', filter: `user_id=eq.${user.id}` },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { stats, loading, error };
}

export function useVulnerabilityTrends() {
  const { user } = useAuth();
  const [trends, setTrends] = useState<{ day: string; high: number; medium: number; low: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTrends = async () => {
      setLoading(true);

      // Get vulnerabilities from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: vulnerabilities } = await supabase
        .from('vulnerabilities')
        .select('severity, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Group by day
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date().getDay();
      const trendData = days.map((day, index) => {
        const dayIndex = (today - 6 + index + 7) % 7;
        const dayVulns = vulnerabilities?.filter((v) => {
          const vulnDay = new Date(v.created_at).getDay();
          return vulnDay === dayIndex;
        }) || [];

        return {
          day,
          high: dayVulns.filter((v) => v.severity === 'high' || v.severity === 'critical').length,
          medium: dayVulns.filter((v) => v.severity === 'medium').length,
          low: dayVulns.filter((v) => v.severity === 'low' || v.severity === 'info').length,
        };
      });

      setTrends(trendData);
      setLoading(false);
    };

    fetchTrends();
  }, [user]);

  return { trends, loading };
}
