import { useParams, Link } from 'react-router-dom';
import { useScanLogs } from '../lib/hooks/useScanLogs';
import { useEffect, useRef } from 'react';

export default function ScanDetail() {
  const { scanId } = useParams<{ scanId: string }>();
  const { logs, scan, loading, error } = useScanLogs({ scanId: scanId || '' });
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error || 'Scan not found'}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-400 bg-blue-500/20';
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Link to="/dashboard/scans" className="hover:text-white">Scans</Link>
            <span>/</span>
            <span className="text-white">{scan.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{scan.target}</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(scan.status)}`}>
          {scan.status === 'running' && (
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2" />
          )}
          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
        </span>
      </div>

      {/* Scan Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="text-zinc-400 text-sm">Type</div>
          <div className="text-white font-medium capitalize">{scan.scan_type}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="text-zinc-400 text-sm">Started</div>
          <div className="text-white font-medium">
            {scan.started_at ? new Date(scan.started_at).toLocaleString() : '-'}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="text-zinc-400 text-sm">Vulnerabilities</div>
          <div className="text-white font-medium">{scan.vulnerabilities_found || 0}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="text-zinc-400 text-sm">Critical</div>
          <div className="text-red-400 font-medium">{scan.critical_count || 0}</div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Scan Activity</h2>
          {scan.status === 'running' && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Live
            </div>
          )}
        </div>
        <div className="h-96 overflow-y-auto p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-zinc-500 text-center py-8">
              {scan.status === 'pending' ? 'Waiting to start...' : 'No logs yet'}
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-zinc-300">
                  <span className="text-zinc-600 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="shrink-0">{getLogIcon(log.level)}</span>
                  <span className={
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    log.level === 'success' ? 'text-emerald-400' :
                    'text-zinc-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Report Download */}
      {scan.status === 'completed' && scan.report_url && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-white font-medium">Scan Complete</div>
              <div className="text-emerald-400 text-sm">Your report is ready to download</div>
            </div>
          </div>
          <a
            href={scan.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </a>
        </div>
      )}
    </div>
  );
}
