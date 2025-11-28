import React from 'react';
import { Globe, Terminal, Bug, Radio, ChevronRight, ChevronDown, Circle } from 'lucide-react';

const TerminalPreview: React.FC = () => {
  return (
    <div className="rounded-lg shadow-2xl bg-[#0f0f0f] border border-[#333] overflow-hidden font-mono text-xs md:text-sm text-gray-300 w-full relative group">
      {/* Title Bar */}
      <div className="bg-[#1a1a1a] border-b border-[#333] px-4 py-2 flex items-center justify-between">
         <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
         </div>
         <div className="text-gray-500 text-xs font-medium">esprit-cli — v2.4.0</div>
         <div className="w-10"></div>
      </div>

      <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">
        
        {/* Left Panel: Log Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col font-mono text-[11px] md:text-[13px] leading-relaxed relative">
           
           {/* Log Entry 1 */}
           <div className="flex gap-3 mb-4 opacity-50">
              <div className="w-0.5 bg-cyan-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-cyan-500 font-bold mb-1">
                    <Globe size={14} /> clicking
                 </div>
              </div>
           </div>

           {/* Log Entry 2: Thinking */}
           <div className="flex gap-3 mb-6">
              <div className="w-0.5 bg-purple-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                    <div className="animate-pulse">●</div> Thinking
                 </div>
                 <div className="text-gray-400 italic pl-1">
                    EXCELLENT! I've found a critical SSRF vulnerability! The URL Health Checker attempted to connect to <span className="text-gray-300 underline">http://127.0.0.1:22</span> (localhost SSH port) and returned a "500 Network Error" after 62ms. This confirm...
                 </div>
              </div>
           </div>

           {/* Log Entry 3 */}
           <div className="flex gap-3 mb-4 opacity-50">
              <div className="w-0.5 bg-cyan-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-cyan-500 font-bold mb-1">
                    <Globe size={14} /> clicking
                 </div>
              </div>
           </div>

           {/* Log Entry 4 */}
           <div className="flex gap-3 mb-4 opacity-50">
              <div className="w-0.5 bg-cyan-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-cyan-500 font-bold mb-1">
                    <Terminal size={14} /> press_key
                 </div>
              </div>
           </div>

           {/* Log Entry 5 */}
           <div className="flex gap-3 mb-4">
              <div className="w-0.5 bg-cyan-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-cyan-500 font-bold mb-1">
                    <Globe size={14} /> typing <span className="text-cyan-200">http://169.254.169.254/latest/meta-data/</span>
                 </div>
              </div>
           </div>

           {/* Log Entry 6: Finding */}
           <div className="flex gap-3 mb-4 mt-8 bg-[#1a0505] p-3 rounded border border-red-900/30">
              <div className="w-0.5 bg-red-500 h-auto self-stretch"></div>
              <div>
                 <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                    <Bug size={14} /> Vulnerability Report
                 </div>
                 <div className="text-white font-bold mb-1">
                    Critical SSRF in URL Health Checker - AWS Metadata Access
                 </div>
                 <div className="text-red-400 text-xs uppercase mb-2">Severity: CRITICAL</div>
                 <div className="text-gray-400 text-xs">
                    Server-Side Request Forgery (SSRF) vulnerability in the URL Health Checker feature allows attackers to make requests to internal services and cloud metadata endpoints.
                 </div>
              </div>
           </div>

           <div className="mt-auto pt-4 text-gray-500 flex items-center justify-between border-t border-[#222]">
              <span>Investigating.</span>
              <span className="text-xs">ESC to stop agent</span>
           </div>
           
           <div className="mt-2 bg-[#1a1a1a] rounded border border-[#333] p-2 flex items-center gap-2">
              <span className="text-gray-500">{'>'}</span>
              <div className="w-2 h-4 bg-gray-500 animate-pulse"></div>
           </div>
        </div>

        {/* Right Panel: Tree View */}
        <div className="w-full md:w-64 border-l border-[#333] bg-[#0c0c0c] p-4 flex flex-col">
           <div className="mb-4">
              <div className="flex items-center gap-1 text-cyan-500 font-bold mb-2">
                 <ChevronDown size={14} />
                 <Radio size={14} />
                 <span>EspritAgent</span>
              </div>
              <div className="pl-4 flex flex-col gap-2 text-gray-400">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full border border-gray-500"></div>
                    <span>SSRF Specialist</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full border border-gray-500"></div>
                    <span>IDOR Proj Spec</span>
                 </div>
                 <div className="flex items-center gap-2 text-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    <span>XSS Hunter</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full border border-gray-500"></div>
                    <span>Auth & Bus Log</span>
                 </div>
              </div>
           </div>
           
           <div className="border-t border-[#222] pt-4 mb-4">
               <div className="flex items-center gap-1 text-gray-500 font-bold mb-2">
                 <ChevronRight size={14} />
                 <span className="opacity-70">EspritAgent</span>
              </div>
           </div>

           <div className="border-t border-[#222] pt-4 mb-4">
               <div className="flex items-center gap-1 text-green-500 font-bold mb-2">
                 <ChevronRight size={14} />
                 <span>WhiteboxAgent</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TerminalPreview;