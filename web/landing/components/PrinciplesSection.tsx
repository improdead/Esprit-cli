import React from 'react';
import { Shield, Crosshair, FileCode } from 'lucide-react';

const PrincipleCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 border border-gray-200 shadow-soft rounded-sm flex flex-col h-full hover:border-black/20 transition-colors">
        <div className="mb-5 text-black">
            {icon}
        </div>
        <h3 className="text-lg font-sans font-medium mb-3">{title}</h3>
        <p className="font-mono text-xs text-gray-600 leading-relaxed">
            {description}
        </p>
    </div>
);

const PrinciplesSection: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto bg-[#e8e8e8]/30">
        <div className="text-center mb-12">
            <span className="text-xs font-mono font-medium tracking-[0.2em] text-gray-400 uppercase block mb-3">Core Principles</span>
            <h2 className="text-3xl md:text-4xl font-sans font-medium">Full spectrum security testing powered by AI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PrincipleCard 
                icon={<Crosshair size={32} strokeWidth={1.5}/>}
                title="Red Team"
                description="Simulate real-world attacks with autonomous red team agents. Our AI agents act as sophisticated adversaries, testing your defenses from an external attacker's perspective to identify exploitable vulnerabilities."
            />
            <PrincipleCard 
                icon={<Shield size={32} strokeWidth={1.5}/>}
                title="Blue Team"
                description="Continuous monitoring and defense validation. Esprit's Blue Team agents integrate with your logging and alerting infrastructure to ensure attacks are detected and blocked, verifying your defensive posture in real-time."
            />
            <PrincipleCard 
                icon={<FileCode size={32} strokeWidth={1.5}/>}
                title="White Box"
                description="Deep code analysis and mapping. White Box agents map your entire repository, enumerate files, detect languages, and identify logic flaws that black-box testing might miss, providing comprehensive coverage."
            />
        </div>
    </section>
  );
};

export default PrinciplesSection;