import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ label: string; value: string; sub: string }> = ({ label, value, sub }) => (
    <div className="border-l-2 border-black pl-5 py-1">
        <div className="text-3xl md:text-4xl font-sans font-medium mb-1.5">{value}</div>
        <div className="text-xs font-mono text-gray-500 max-w-[150px] leading-tight">{sub}</div>
    </div>
);

const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-20 px-6 max-w-5xl mx-auto border-t border-gray-200">
      <div className="mb-10">
         <span className="text-xs font-mono font-medium tracking-[0.2em] text-gray-400 uppercase">About Us</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
           <h2 className="text-3xl md:text-4xl font-sans font-medium leading-[1.1] mb-6">
              AI agents that find bugs, vulnerabilities and patch them for you
           </h2>
           <p className="font-mono text-gray-600 leading-relaxed mb-8 text-xs md:text-sm max-w-lg">
              Our agents scan code, test infrastructure, and simulate real attackers.
              Every finding is verified by multiple agents to keep noise low and trust high.
           </p>
           <Button variant="primary" className="bg-black text-white px-6 py-2.5 text-sm" onClick={() => navigate('/dashboard')}>Start a pentest</Button>
        </div>

        <div className="flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
                <StatCard 
                    label="Accuracy" 
                    value="95%+" 
                    sub="Vulnerability validation accuracy" 
                />
                 <StatCard 
                    label="Tools" 
                    value="50+" 
                    sub="Integrated security tools" 
                />
                 <StatCard 
                    label="Speed" 
                    value="10x" 
                    sub="Faster than manual pen testing" 
                />
                 <div className="flex items-center">
                    <div className="font-mono text-sm text-gray-400 italic">
                        "Esprit finds things our red team missed in half the time."
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;