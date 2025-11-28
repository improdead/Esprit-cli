import React from 'react';

const CodeWindow: React.FC = () => {
  return (
    <div className="bg-white rounded-md shadow-soft border border-gray-200 overflow-hidden font-mono text-xs md:text-sm">
      {/* Window Title Bar */}
      <div className="bg-[#fcfcfc] border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-gray-400 text-xs">serviceWorker.js</div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-100 bg-[#fafafa] p-4 hidden sm:block">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Explorer</div>
          <div className="text-[10px] font-bold text-gray-600 mb-2 uppercase">Create-React-App</div>
          
          <div className="flex flex-col gap-1 text-gray-500">
             <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-200 rounded px-1">
               <span className="opacity-50">›</span> .github
             </div>
             <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-200 rounded px-1">
               <span className="opacity-50">›</span> .vscode
             </div>
             <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-200 rounded px-1">
               <span className="opacity-50">›</span> node_modules
             </div>
             <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-200 rounded px-1">
               <span className="opacity-50">›</span> public
             </div>
             <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-200 rounded px-1">
               <span className="opacity-100">∨</span> src
             </div>
             <div className="flex flex-col gap-1 pl-6 border-l border-gray-200 ml-3">
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">components</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1 text-blue-600">CodeEditor.tsx</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">Sidebar.tsx</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">WindowHeader.tsx</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">App.tsx</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">index.tsx</div>
                <div className="cursor-pointer hover:bg-gray-200 rounded px-1">serviceWorker.js</div>
             </div>
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-white p-6 overflow-auto relative">
           {/* Line Numbers */}
           <div className="absolute left-0 top-6 bottom-0 w-8 text-right pr-3 text-gray-300 select-none text-[11px] leading-6 font-mono">
             {Array.from({length: 20}).map((_, i) => (
               <div key={i}>{i + 1}</div>
             ))}
           </div>

           {/* Code Content */}
           <div className="pl-8 leading-6 text-[13px]">
             <div className="text-gray-400">// CSS Syntax Highlighter UI</div>
             <div className="text-gray-400">// Manages the Figma plugin interface</div>
             <div><span className="text-purple-600">import</span> PluginManager <span className="text-purple-600">from</span> <span className="text-green-600">'figma.js'</span></div>
             <div><span className="text-blue-600">interface</span> PluginSettings {'{'}</div>
             <div className="pl-4">cssColorScheme: Record&lt;<span className="text-yellow-600">string</span>, {'{'}</div>
             <div className="pl-8">r: <span className="text-yellow-600">number</span>; g: <span className="text-yellow-600">number</span>; b: <span className="text-yellow-600">number</span>;</div>
             <div className="pl-4">{'}'}>;</div>
             <div className="pl-4">Number?: {'{'} value: <span className="text-yellow-600">number</span> {'}'};</div>
             <div className="pl-4">enabled: <span className="text-yellow-600">boolean</span>;</div>
             <div>{'}'}</div>
             <div><span className="text-blue-600">let</span> settings: PluginSettings = {'{'}</div>
             <div className="pl-4">cssColorScheme: {'{'}</div>
             <div className="pl-8"><span className="text-green-600">'selector'</span>: {'{'} r: <span className="text-blue-500">0.8</span>, g: <span className="text-blue-500">0.7</span>, b: <span className="text-blue-500">0.9</span> {'}'},</div>
             <div className="pl-8"><span className="text-green-600">'property'</span>: {'{'} r: <span className="text-blue-500">0.5</span>, g: <span className="text-blue-500">0.7</span>, b: <span className="text-blue-500">0.9</span> {'}'},</div>
             <div className="pl-8"><span className="text-green-600">'value'</span>: {'{'} r: <span className="text-blue-500">0.8</span>, g: <span className="text-blue-500">0.6</span>, b: <span className="text-blue-500">0.5</span> {'}'},</div>
             <div className="pl-8"><span className="text-green-600">'string'</span>: {'{'} r: <span className="text-blue-500">0.8</span>, g: <span className="text-blue-500">0.6</span>, b: <span className="text-blue-500">0.4</span> {'}'},</div>
             <div className="pl-8"><span className="text-green-600">'number'</span>: {'{'} r: <span className="text-blue-500">0.6</span>, g: <span className="text-blue-500">0.7</span>, b: <span className="text-blue-500">0.5</span> {'}'},</div>
             <div className="pl-8"><span className="text-green-600">'comment'</span>: {'{'} r: <span className="text-blue-500">0.4</span>, g: <span className="text-blue-500">0.6</span>, b: <span className="text-blue-500">0.3</span> {'}'},</div>
             <div className="pl-4">{'}'},</div>
             <div className="pl-4">enabled: <span className="text-red-500">true</span>,</div>
             <div>{'}'}</div>
           </div>
           
           {/* The orange dot overlay */}
           <div className="absolute right-8 top-12 w-2 h-2 rounded-full bg-orange-500"></div>
        </div>
      </div>
    </div>
  );
};

export default CodeWindow;