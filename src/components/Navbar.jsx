import { ShieldCheck, Code, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg border border-indigo-500/20">
            <ShieldCheck size={22} strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">
            Zero<span className="text-indigo-400 font-medium">Convert</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-zinc-200 transition-colors">How it works</a>
          <a href="#" className="hover:text-zinc-200 transition-colors">Privacy Guarantee</a>
          
          <div className="h-4 w-px bg-zinc-800"></div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-2"
            title="View Source on GitHub"
          >
            <Code size={18} />
            <span>Source</span>
          </a>
        </div>

        <button className="md:hidden text-zinc-400 hover:text-zinc-200 transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}