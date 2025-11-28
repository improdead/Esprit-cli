
import React, { useState } from 'react';
import { Shield, GitCommit, Cloud, CheckCircle, XCircle, AlertTriangle, Lock } from 'lucide-react';

const UseCasesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const cases = [
    {
      id: 0,
      title: "Automated Compliance",
      description: "Map security findings directly to SOC2, HIPAA, and ISO 27001 controls to automate evidence collection.",
      icon: <Shield size={20} />,
      content: <ComplianceMockup />
    },
    {
      id: 1,
      title: "CI/CD Guardrails",
      description: "Prevent vulnerabilities from reaching production by blocking builds that fail security checks.",
      icon: <GitCommit size={20} />,
      content: <CicdMockup />
    },
    {
      id: 2,
      title: "Cloud Security Posture",
      description: "Continuously scan AWS, GCP, and Azure environments for misconfigurations and drift.",
      icon: <Cloud size={20} />,
      content: <CloudMockup />
    }
  ];

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto border-t border-gray-200">
      <div className="mb-12">
         <span className="text-xs font-mono font-medium tracking-[0.2em] text-gray-400 uppercase block mb-3">Use Cases</span>
         <h2 className="text-3xl md:text-4xl font-sans font-medium">Security for every stage</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-stretch">
        {/* Left: Interactive List */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {cases.map((item, index) => (
            <div 
              key={index}
              onClick={() => setActiveTab(index)}
              className={`p-6 border rounded-sm cursor-pointer transition-all duration-200 group ${
                activeTab === index 
                  ? 'bg-white border-black shadow-soft translate-x-2' 
                  : 'bg-transparent border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                 <div className={`p-2 rounded-sm transition-colors ${activeTab === index ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 group-hover:text-black'}`}>
                    {item.icon}
                 </div>
                 <h3 className={`text-xl font-sans font-medium transition-colors ${activeTab === index ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                    {item.title}
                 </h3>
              </div>
              <p className={`font-mono text-sm pl-[52px] leading-relaxed transition-colors ${activeTab === index ? 'text-gray-600' : 'text-gray-400'}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Mockup Display */}
        <div className="flex-1">
           <div className="w-full h-full min-h-[400px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
              {/* Old Style Window Controls (Light Frame) */}
              <div className="bg-[#fcfcfc] px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                 </div>
                 <div className="ml-4 text-xs font-mono text-gray-400 flex items-center gap-2">
                    <Lock size={10} />
                    <span>esprit-agent — {cases[activeTab].title.toLowerCase().replace(/\s/g, '-')}</span>
                 </div>
              </div>
              
              {/* Content Area (Dark CLI) */}
              <div className="flex-1 bg-[#0f0f0f] p-6 overflow-hidden relative font-mono text-xs text-gray-300">
                 {cases[activeTab].content}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

// --- Mockup Components ---

const ComplianceMockup = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between text-gray-500 border-b border-gray-800 pb-2 mb-2">
       <span>CONTROL ID</span>
       <span>STATUS</span>
       <span className="w-1/3">EVIDENCE</span>
    </div>

    <div className="flex items-center justify-between group">
       <span className="text-cyan-400 font-bold">SOC2-CC6.1</span>
       <span className="text-green-500 flex items-center gap-2"><CheckCircle size={12}/> PASS</span>
       <span className="w-1/3 text-gray-500 truncate">AWS Config Enabled (us-east-1)</span>
    </div>

    <div className="flex items-center justify-between group">
       <span className="text-cyan-400 font-bold">SOC2-CC6.6</span>
       <span className="text-red-500 flex items-center gap-2 animate-pulse"><XCircle size={12}/> FAIL</span>
       <span className="w-1/3 text-gray-400 truncate">Port 22 Open (0.0.0.0/0)</span>
    </div>

    <div className="flex items-center justify-between group opacity-50">
       <span className="text-cyan-400 font-bold">SOC2-CC6.8</span>
       <span className="text-green-500 flex items-center gap-2"><CheckCircle size={12}/> PASS</span>
       <span className="w-1/3 text-gray-500 truncate">WAF Active (CloudFront)</span>
    </div>

     <div className="mt-8 bg-[#1a1a1a] p-3 border-l-2 border-red-500 text-gray-400">
        <div className="text-white font-bold mb-1">Remediation Suggestion</div>
        <div className="mb-2">Close Port 22 on Security Group <span className="text-yellow-500">sg-0a1b2c3d</span>. Use SSM Session Manager instead.</div>
        <div className="text-cyan-500 cursor-pointer hover:underline">{'>'} Apply Fix (auto-generated)</div>
     </div>
  </div>
);

const CicdMockup = () => (
  <div className="flex flex-col gap-2">
    <div className="text-gray-500 mb-4">$ git push origin main</div>
    
    <div className="flex gap-2 text-gray-400">
       <span className="text-blue-500">➜</span>
       <span>Triggering Esprit Security Gate...</span>
    </div>
    
    <div className="pl-4 border-l border-gray-800 flex flex-col gap-1 my-2">
       <div className="flex items-center gap-2">
          <CheckCircle size={12} className="text-green-500"/>
          <span>Dependency Scan (npm audit)</span>
       </div>
       <div className="flex items-center gap-2">
          <CheckCircle size={12} className="text-green-500"/>
          <span>Secret Detection</span>
       </div>
       <div className="flex items-center gap-2 text-white font-bold">
          <div className="animate-spin w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full"></div>
          <span>SAST Analysis</span>
       </div>
    </div>

    <div className="bg-[#2a0e0e] p-3 rounded text-red-200 mt-2 border border-red-900/50">
       <div className="flex items-center gap-2 font-bold mb-1 text-red-500">
          <AlertTriangle size={14} /> CRITICAL VULNERABILITY FOUND
       </div>
       <div>SQL Injection detected in <span className="text-white font-mono">auth/login.ts:42</span></div>
       <div className="mt-2 opacity-75 text-[10px] bg-black/30 p-2 rounded font-mono">
          query = `SELECT * FROM users WHERE user = '${'{'}userInput{'}'}'`
       </div>
    </div>

    <div className="text-red-500 font-bold mt-2">
       [BLOCK] Pipeline halted. Vulnerability threshold exceeded.
    </div>
  </div>
);

const CloudMockup = () => (
  <div className="flex flex-col gap-2">
    <div className="text-gray-500">$ esprit cloud scan --provider aws --region us-east-1</div>
    
    <div className="grid grid-cols-3 gap-2 my-4">
       <div className="bg-[#1a1a1a] p-2 text-center rounded border border-[#333]">
          <div className="text-gray-500 text-[10px] uppercase">Resources</div>
          <div className="text-xl font-bold text-white">4,201</div>
       </div>
       <div className="bg-[#1a1a1a] p-2 text-center rounded border border-[#333]">
          <div className="text-gray-500 text-[10px] uppercase">Misconfigs</div>
          <div className="text-xl font-bold text-yellow-500">12</div>
       </div>
       <div className="bg-[#1a1a1a] p-2 text-center rounded border border-[#333]">
          <div className="text-gray-500 text-[10px] uppercase">Critical</div>
          <div className="text-xl font-bold text-red-500 animate-pulse">2</div>
       </div>
    </div>

    <div className="text-gray-300 font-bold mb-1">Findings:</div>
    <div className="space-y-2">
       <div className="flex gap-2 items-start">
          <span className="text-red-500 mt-0.5"><XCircle size={12}/></span>
          <div>
             <div className="text-red-400 font-bold">S3 Bucket Publicly Accessible</div>
             <div className="text-gray-500 text-[10px]">arn:aws:s3:::customer-pii-backup</div>
          </div>
       </div>
       <div className="flex gap-2 items-start">
          <span className="text-yellow-500 mt-0.5"><AlertTriangle size={12}/></span>
          <div>
             <div className="text-yellow-400 font-bold">IAM Role with AdministratorAccess</div>
             <div className="text-gray-500 text-[10px]">arn:aws:iam::123456789:role/jenkins-deploy</div>
          </div>
       </div>
    </div>
  </div>
);

export default UseCasesSection;
