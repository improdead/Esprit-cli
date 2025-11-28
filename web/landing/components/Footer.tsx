import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-gray-300 bg-[#e8e8e8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-500 gap-8 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
                <div className="flex items-center gap-2 text-black">
                     <img src="/Espritlogo.png" alt="Esprit Labs" className="h-10 w-auto" />
                     <span className="font-bold tracking-tight uppercase">Esprit Labs</span>
                </div>
                <span>© 2025 Esprit. All rights reserved.</span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;