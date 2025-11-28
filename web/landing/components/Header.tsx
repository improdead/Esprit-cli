import React from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#e8e8e8]/90 backdrop-blur-md border-b border-gray-300 h-[72px]">
      <div className="w-full h-full flex items-center justify-between relative px-0">
        {/* Logo Section - Left Aligned */}
        <div className="flex items-center pl-6 md:pl-8 z-20 h-full">
          <img src="/Espritlogo.png" alt="Esprit Labs" className="h-16 w-auto" />
        </div>

        {/* Centered Navigation */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <nav className="flex items-center gap-8 text-[13px] font-sans font-medium tracking-wide text-black">
            <Link to="/" className="hover:text-gray-600 transition-colors uppercase">Home</Link>
            <a href="#about" className="hover:text-gray-600 transition-colors uppercase">About</a>
            <a href="#faq" className="hover:text-gray-600 transition-colors uppercase">FAQ</a>
            <a href="#" className="hover:text-gray-600 transition-colors uppercase">Contact</a>
          </nav>
        </div>

        {/* Right Section: CTA & Mobile Toggle */}
        <div className="ml-auto h-full flex items-center z-20">
          {/* Login Button */}
          <button onClick={() => navigate('/login')} className="hidden md:flex h-full px-6 items-center font-mono text-xs uppercase tracking-widest hover:bg-black/5 transition-colors">
            Log in
          </button>
          {/* Full Height CTA Button */}
          <button onClick={() => navigate('/signup')} className="hidden md:flex h-full px-8 bg-black text-white items-center gap-3 font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors group">
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform"/>
          </button>

          {/* Mobile Menu Toggle (Visible on Mobile) */}
          <div className="md:hidden flex items-center pr-6 h-full border-l border-gray-300 pl-6">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#e8e8e8] border-b border-gray-300 flex flex-col font-sans text-sm uppercase shadow-xl">
          <Link to="/" className="block py-4 px-6 border-b border-gray-200 hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="#about" className="block py-4 px-6 border-b border-gray-200 hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#faq" className="block py-4 px-6 border-b border-gray-200 hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
          <a href="#" className="block py-4 px-6 border-b border-gray-200 hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <button className="py-4 px-6 border-b border-gray-200 hover:bg-white/50 text-left" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
            Log in
          </button>
          <button className="py-4 px-6 bg-black text-white flex items-center gap-2 justify-center hover:bg-gray-800 font-mono tracking-widest w-full" onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}>
             Get Started <ArrowRight size={16} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;