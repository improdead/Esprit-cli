import React from 'react';

interface BadgeProps {
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-[10px] font-mono tracking-wide text-gray-600 hover:border-gray-300 cursor-pointer transition-colors">
      <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
      <span className="uppercase">{text}</span>
    </div>
  );
};

export default Badge;