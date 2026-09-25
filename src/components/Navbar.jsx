import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Code, Menu, X, Cpu, Lock, Wrench } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleScrollOrNavigate = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo -> Routes to Home */}
        <Link 
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
            <ShieldCheck size={22} strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">
            Zero<span className="text-indigo-400 font-medium">Convert</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (Real URLs for Google SEO) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link 
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hover:text-zinc-100 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-zinc-900 ${
              location.pathname === '/' ? 'text-zinc-100' : ''
            }`}
          >
            <Wrench size={15} className="text-indigo-400" />
            Converter
          </Link>

          <Link 
            to="/how-it-works"
            onClick={() => handleScrollOrNavigate('how-it-works')}
            className={`hover:text-zinc-100 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-zinc-900 ${
              location.pathname === '/how-it-works' ? 'text-indigo-400 bg-indigo-500/10' : ''
            }`}
          >
            <Cpu size={15} className="text-indigo-400" />
            How it works
          </Link>
          
          <Link 
            to="/privacy"
            onClick={() => handleScrollOrNavigate('privacy-guarantee')}
            className={`hover:text-zinc-100 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-zinc-900 ${
              location.pathname === '/privacy' ? 'text-emerald-400 bg-emerald-500/10' : ''
            }`}
          >
            <Lock size={15} className="text-emerald-400" />
            Privacy Guarantee
          </Link>
          
          {/* <div className="h-4 w-px bg-zinc-800"></div> */}
          
          {/* <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-zinc-900"
            title="View Source on GitHub"
          >
            <Code size={18} />
            <span>Source</span>
          </a> */}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-zinc-200 transition-colors p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-3">
          <Link 
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            <Wrench size={16} className="text-indigo-400" />
            Converter Workspace
          </Link>
          <Link 
            to="/how-it-works"
            onClick={() => handleScrollOrNavigate('how-it-works')}
            className="flex items-center gap-2.5 py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            <Cpu size={16} className="text-indigo-400" />
            How it works
          </Link>
          <Link 
            to="/privacy"
            onClick={() => handleScrollOrNavigate('privacy-guarantee')}
            className="flex items-center gap-2.5 py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            <Lock size={16} className="text-emerald-400" />
            Privacy Guarantee
          </Link>
        </div>
      )}
    </nav>
  );
}