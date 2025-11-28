import { useState, useEffect, useCallback } from 'react';
import { supabase, ScanLog, Scan } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseScanLogsOptions {
  scanId: string;
  onStatusChange?: (status: Scan['status']) => void;
}

export function useScanLogs({ scanId, onStatusChange }: UseScanLogsOptions) {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial logs and scan
  const fetchData = useCallback(async () => {
    if (!scanId) return;

    setLoading(true);
    try {
      // Fetch scan details
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (scanError) throw scanError;
      setScan(scanData);

      // Fetch existing logs
      const { data: logsData, error: logsError } = await supabase
        .from('scan_logs')
        .select('*')
        .eq('scan_id', scanId)
        .order('timestamp', { ascending: true });

      if (logsError) throw logsError;
      setLogs(logsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!scanId) return;

    fetchData();

    // Subscribe to new logs
    const logsChannel: RealtimeChannel = supabase
      .channel(`scan_logs:${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_logs',
          filter: `scan_id=eq.${scanId}`,
        },
        (payload) => {
          const newLog = payload.new as ScanLog;
          setLogs((prev) => [...prev, newLog]);
        }
      )
      .subscribe();

    // Subscribe to scan status changes
    const scanChannel: RealtimeChannel = supabase
      .channel(`scan:${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scans',
          filter: `id=eq.${scanId}`,
        },
        (payload) => {
          const updatedScan = payload.new as Scan;
          setScan(updatedScan);
          onStatusChange?.(updatedScan.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
      supabase.removeChannel(scanChannel);
    };
  }, [scanId, fetchData, onStatusChange]);

  return {
    logs,
    scan,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook for watching multiple scans (e.g., dashboard)
export function useScansRealtime(userId: string | undefined) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial scans
  useEffect(() => {
    if (!userId) return;

    const fetchScans = async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setScans(data);
      }
      setLoading(false);
    };

    fetchScans();

    // Subscribe to changes
    const channel = supabase
      .channel(`user_scans:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scans',
          filter: `user_id=eq.${userId}`,
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
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { scans, loading };
}
