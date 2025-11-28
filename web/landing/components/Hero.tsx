import React from 'react';
import Button from './Button';
import TerminalPreview from './TerminalPreview';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-20 pb-24 px-6 flex flex-col items-center max-w-[1200px] mx-auto relative">

      {/* Decorative Dots - Left (Triangle Pattern) */}
      <div className="absolute left-8 top-32 hidden lg:block">
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((count, rowIndex) => (
            <div key={`left-row-${rowIndex}`} className="flex gap-1.5">
              {[...Array(count)].map((_, i) => (
                <div key={`left-dot-${rowIndex}-${i}`} className="w-1 h-1 bg-black/50 rounded-sm"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Dots - Right (Triangle Pattern) */}
      <div className="absolute right-8 top-32 hidden lg:block">
        <div className="flex flex-col gap-1.5 items-end">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((count, rowIndex) => (
            <div key={`right-row-${rowIndex}`} className="flex gap-1.5">
              {[...Array(count)].map((_, i) => (
                <div key={`right-dot-${rowIndex}-${i}`} className="w-1 h-1 bg-black/50 rounded-sm"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-medium text-center max-w-3xl leading-[1.0] mb-6 text-[#111] tracking-tight">
        AI Agents<br />
        for Pen Testing
      </h1>

      {/* Subheadline */}
      <p className="font-mono text-xs md:text-sm text-center max-w-xl text-[#666] mb-10 leading-relaxed tracking-tight">
        Autonomous security agents that work together to find vulnerabilities,
        validate them, and provide clear fixes. Faster than any manual workflow.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-16">
        <Button variant="primary" size="md" className="gap-2" onClick={() => navigate('/dashboard')}>
          Get Started <ArrowRight size={14} />
        </Button>
        <Button variant="outline" size="md" className="bg-transparent border-gray-300 gap-2">
          Learn More <ArrowRight size={14} className="text-gray-400"/>
        </Button>
      </div>

      {/* Terminal/CLI Preview */}
      <div className="w-full max-w-4xl relative px-2 sm:px-4">
         <TerminalPreview />

         {/* Background Glow Effect */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      </div>
    </section>
  );
};

export default Hero;