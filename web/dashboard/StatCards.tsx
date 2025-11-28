import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStats } from '../lib/hooks/useStats';

export const StatCards: React.FC = () => {
  const { stats, loading } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded shadow-sm animate-pulse">
            <div className="h-10 w-10 bg-gray-100 rounded mb-4"></div>
            <div className="h-3 w-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-8 w-16 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        title="Total Vulnerabilities"
        value={stats.totalVulnerabilities.toLocaleString()}
        change={stats.totalVulnerabilities > 0 ? `+${stats.totalChange}%` : '—'}
        icon={<Shield className="text-black" size={20} />}
        trend={stats.totalVulnerabilities > 0 ? "up" : undefined}
        neutral={stats.totalVulnerabilities === 0}
      />
      <Card
        title="Critical Issues"
        value={stats.criticalIssues.toString()}
        change={stats.criticalIssues > 0 ? `${stats.criticalChange}%` : '—'}
        icon={<AlertTriangle className="text-orange-600" size={20} />}
        trend={stats.criticalIssues > 0 ? (stats.criticalChange < 0 ? "down" : "up") : undefined}
        neutral={stats.criticalIssues === 0}
      />
      <Card
        title="Active Scans"
        value={stats.activeScans.toString()}
        change={stats.activeScans > 0 ? "Running" : "None"}
        icon={<TrendingUp className="text-gray-600" size={20} />}
        neutral
      />
      <Card
        title="Remediated"
        value={stats.remediated.toLocaleString()}
        change={stats.remediated > 0 ? `+${stats.remediatedChange}%` : '—'}
        icon={<CheckCircle className="text-black" size={20} />}
        trend={stats.remediated > 0 ? "up" : undefined}
        neutral={stats.remediated === 0}
      />
    </div>
  );
};

const Card: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  neutral?: boolean;
}> = ({ title, value, change, icon, trend, neutral }) => (
  <div className="bg-white border border-gray-200 p-6 rounded shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 border border-gray-100 rounded text-gray-900 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors duration-300">
        {React.cloneElement(icon as React.ReactElement, { className: 'currentColor' })}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
        neutral ? 'bg-gray-100 text-gray-600' :
        trend === 'up' ? 'bg-gray-100 text-green-700' : 'bg-orange-50 text-orange-700'
      }`}>
        {change}
        {!neutral && (trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />)}
      </div>
    </div>
    <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-sans font-medium text-gray-900 tracking-tight">{value}</p>
  </div>
);