import React, { useState } from 'react';
import { StatCards } from './StatCards';
import { VulnerabilityTrendChart, VulnerabilityDistributionChart } from './Charts';
import { RecentActivity } from './RecentActivity';
import { useRecentScans } from '../lib/hooks/useScans';
import { useAuth } from '../lib/auth-context';

const Dashboard: React.FC = () => {
  const [showDistribution, setShowDistribution] = useState(false);
  const { recentScans, loading: scansLoading } = useRecentScans(6);
  const { profile } = useAuth();

  // Transform scans to the format expected by RecentActivity
  const formattedScans = recentScans.map((scan) => ({
    id: scan.id,
    target: scan.target,
    date: formatRelativeTime(scan.created_at),
    status: mapScanStatus(scan.status),
    issuesFound: scan.vulnerabilities_found || 0,
  }));

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  function mapScanStatus(status: string): 'In Progress' | 'Completed' | 'Failed' {
    switch (status) {
      case 'running':
      case 'pending':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
      case 'cancelled':
        return 'Failed';
      default:
        return 'Completed';
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-sans font-medium text-gray-900 mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-500">
          {formattedScans.length > 0
            ? `You have ${formattedScans.filter((s) => s.status === 'In Progress').length} active scans running.`
            : 'Start a new penetration test to see your results here.'}
        </p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showDistribution ? (
            <div className="relative">
              <button
                onClick={() => setShowDistribution(false)}
                className="absolute top-6 right-6 z-10 text-xs font-mono text-gray-500 hover:text-black border border-gray-200 hover:border-black px-3 py-1.5 rounded transition-colors bg-white shadow-sm"
              >
                Back to Trends
              </button>
              <VulnerabilityDistributionChart />
            </div>
          ) : (
            <div onClick={() => setShowDistribution(true)} className="cursor-pointer">
              <VulnerabilityTrendChart />
            </div>
          )}
        </div>
        <div className="lg:col-span-1 flex flex-col">
          {scansLoading ? (
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm flex items-center justify-center h-full">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full"></div>
            </div>
          ) : (
            <RecentActivity scans={formattedScans} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {/* System Logs */}
         <div className="bg-white border border-gray-200 rounded p-6 h-[400px] overflow-hidden flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900 font-sans font-medium text-lg">System Logs</h3>
              <button className="text-[10px] text-gray-500 hover:text-black font-mono uppercase tracking-widest border-b border-transparent hover:border-black transition-all">View All Logs</button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
               {[1,2,3,4,5,6].map((i) => (
                 <div key={i} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">
                    <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform"></div>
                    <div>
                       <p className="text-sm text-gray-800 font-medium">New vulnerability detected</p>
                       <p className="text-xs text-gray-500 mt-1">Found in <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700">prod-api-gateway</span></p>
                       <span className="text-[10px] text-gray-400 font-mono block mt-1.5 uppercase tracking-wide">2 hours ago • Automated Scan</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </>
  );
};

export default Dashboard;