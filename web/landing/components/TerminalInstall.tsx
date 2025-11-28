import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const TerminalInstall: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const command = "curl -fsSL https://forge.ai/install | sh";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm p-1 font-mono text-xs md:text-sm">
      <div className="flex items-center gap-2 mb-2 px-1 pt-1">
        <div className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-bold border border-gray-300">MACOS / LINUX</div>
        <div className="px-2 py-0.5 text-gray-400 rounded text-[10px] border border-transparent hover:border-gray-200 cursor-pointer">WINDOWS</div>
      </div>
      <div className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between group relative">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="text-orange-500 font-bold">{'>'}</span>
          <span className="text-gray-800">{command}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="ml-2 text-gray-400 hover:text-black transition-colors p-1 rounded hover:bg-gray-100"
          title="Copy command"
        >
          {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default TerminalInstall;