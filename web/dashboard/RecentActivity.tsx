import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface RecentScan {
  id: string;
  target: string;
  date: string;
  status: 'In Progress' | 'Completed' | 'Failed';
  issuesFound: number;
}

interface RecentActivityProps {
  scans: RecentScan[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ scans }) => {
  // Show only first 4 scans to make card shorter
  const displayedScans = scans.slice(0, 4);

  return (
    <div className="bg-white rounded border border-gray-200 p-4 pb-[64px] shadow-sm flex flex-col">
      <div className="mb-4">
        <h3 className="font-sans font-medium text-base text-gray-900 mb-0.5">Recent Scans</h3>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Live Feed</p>
      </div>
      
      <div className="space-y-2 mb-4">
        {displayedScans.map((scan) => (
          <div key={scan.id} className="group flex items-center justify-between p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                scan.status === 'Completed' ? 'bg-emerald-500' :
                scan.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
              }`} />
              <div>
                <p className="text-xs font-medium text-gray-900 truncate max-w-[100px] font-sans">{scan.target}</p>
                <p className="text-[9px] text-gray-500 font-mono">{scan.date}</p>
              </div>
            </div>
            <div className="text-right">
              {scan.status === 'Completed' ? (
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                  {scan.issuesFound}
                </span>
              ) : (
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wide">{scan.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 border border-dashed border-gray-300 rounded text-[10px] font-mono text-gray-500 hover:text-black hover:border-gray-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
        View All Activity <ArrowRight size={12} />
      </button>
    </div>
  );
};