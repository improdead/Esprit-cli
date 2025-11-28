import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const data = [
  { name: 'Mon', high: 4, medium: 12, low: 20 },
  { name: 'Tue', high: 3, medium: 15, low: 18 },
  { name: 'Wed', high: 7, medium: 8, low: 24 },
  { name: 'Thu', high: 2, medium: 18, low: 22 },
  { name: 'Fri', high: 5, medium: 14, low: 28 },
  { name: 'Sat', high: 1, medium: 10, low: 15 },
  { name: 'Sun', high: 0, medium: 5, low: 10 },
];

const severityData = [
  { name: 'SQL Injection', count: 12 },
  { name: 'XSS', count: 28 },
  { name: 'Misconfig', count: 45 },
  { name: 'Auth Broken', count: 18 },
  { name: 'Data Exposure', count: 15 },
];

export const VulnerabilityTrendChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded p-6 h-[400px] shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 font-sans font-medium text-lg group-hover:text-black transition-colors">Vulnerability Trends</h3>
        <select 
          className="bg-white border border-gray-200 text-xs font-mono text-gray-600 rounded px-2 py-1 outline-none focus:border-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#52525b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#18181b' }}
          />
          <Area type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" name="Critical" />
          <Area type="monotone" dataKey="medium" stroke="#52525b" strokeWidth={2} fillOpacity={1} fill="url(#colorMedium)" name="Medium" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const VulnerabilityDistributionChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded p-6 h-[400px] shadow-sm">
      <h3 className="text-gray-900 font-sans font-medium text-lg mb-6">Top Vulnerability Classes</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={severityData} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
          <XAxis type="number" stroke="#a1a1aa" fontSize={11} fontFamily="JetBrains Mono" hide />
          <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} width={120} />
          <Tooltip 
             cursor={{fill: '#f4f4f5'}}
             contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="count" fill="#18181b" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};