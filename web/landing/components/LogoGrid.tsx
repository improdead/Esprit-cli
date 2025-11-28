import React from 'react';

// Simplified SVG Logos for the "Trusted" Section
const SparkLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const YCLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-auto">
    <rect width="24" height="24" rx="2" fill="#F06529"/>
    <path d="M6 5L10 12V19H14V12L18 5H15.5L12 11L8.5 5H6Z" fill="white"/>
  </svg>
);

const TechstarsLogo = () => (
  <div className="flex items-center gap-1 font-sans font-bold text-xl tracking-tight text-black">
    techstars_
  </div>
);

const ChartLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-500">
    <rect x="2" y="10" width="4" height="12" rx="1" />
    <rect x="10" y="6" width="4" height="16" rx="1" />
    <rect x="18" y="14" width="4" height="8" rx="1" />
  </svg>
);

const AbstractNLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
     <path d="M21 12L12 3L3 12L12 21L21 12Z" fill="black"/>
     <path d="M12 6L16 12L12 18L8 12L12 6Z" fill="white"/>
  </svg>
);

const PurpleLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-purple-600">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="4" />
    <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LogoBox: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className="flex items-center justify-center p-8 border border-gray-200 bg-white h-32 hover:border-gray-300 transition-colors">
        <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {children}
        </div>
    </div>
);

const LogoGrid: React.FC = () => {
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xs font-mono font-medium tracking-[0.2em] text-gray-400 uppercase">Trusted</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-gray-200 bg-gray-50/50">
         {/* Using borders on the boxes themselves for that sharp grid look */}
         <div className="border-r border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <SparkLogo />
         </div>
         <div className="border-r border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2"><span className="bg-[#F06529] text-white font-bold p-0.5 px-1 rounded-sm text-xs">Y</span> <span className="font-bold text-gray-800">Combinator</span></div>
         </div>
         <div className="border-r border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <TechstarsLogo />
         </div>
         <div className="border-r border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <ChartLogo />
         </div>
         <div className="border-r border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
             <svg width="32" height="32" viewBox="0 0 24 24" className="fill-current text-black">
                 <path d="M2 12L7 4H12L7 12H12L7 20L2 12Z"/>
                 <path d="M12 12L17 4H22L17 12H22L17 20L12 12Z" fillOpacity="0.5"/>
             </svg>
         </div>
         <div className="border-b border-gray-200 bg-white h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <svg width="32" height="32" viewBox="0 0 24 24" className="fill-current text-purple-500">
               <circle cx="12" cy="12" r="10" />
            </svg>
         </div>
      </div>
    </section>
  );
};

export default LogoGrid;