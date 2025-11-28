import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { useScans } from '../lib/hooks/useScans';

type StatusFilter = 'all' | 'running' | 'completed' | 'failed';

const Scans: React.FC = () => {
  const { scans, loading } = useScans();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const navigate = useNavigate();

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.target.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'running' && (scan.status === 'running' || scan.status === 'pending')) ||
      (statusFilter === 'completed' && scan.status === 'completed') ||
      (statusFilter === 'failed' && (scan.status === 'failed' || scan.status === 'cancelled'));
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'pending':
        return <Loader2 size={14} className="animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      running: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      completed: 'bg-green-50 text-green-700 border-green-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
      cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.cancelled;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-sans font-medium text-gray-900 mb-2">Scan History</h1>
        <p className="text-gray-600 font-mono text-sm">View and manage your penetration test scans</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'running', 'completed', 'failed'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wide rounded border transition-colors ${
                statusFilter === status
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Scans List */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading scans...</p>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="p-12 text-center">
            <Target size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scans found</h3>
            <p className="text-gray-500 mb-4">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start a new penetration test to see results here'}
            </p>
            <button
              onClick={() => navigate('/dashboard/pentest')}
              className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
            >
              New Scan
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Target
                </th>
                <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Vulnerabilities
                </th>
                <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          scan.target_type === 'url' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                      ></div>
                      <span className="font-mono text-sm text-gray-900 truncate max-w-xs">
                        {scan.target}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono uppercase text-gray-500">
                      {scan.scan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        scan.status
                      )}`}
                    >
                      {getStatusIcon(scan.status)}
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {scan.status === 'completed' ? (
                      <div className="flex items-center gap-2">
                        {(scan.critical_count || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle size={12} />
                            {scan.critical_count}
                          </span>
                        )}
                        <span className="text-sm text-gray-900">
                          {scan.vulnerabilities_found || 0} total
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(scan.created_at)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {scan.report_url && (
                      <a
                        href={scan.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
                      >
                        Report <ExternalLink size={14} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Scans;
