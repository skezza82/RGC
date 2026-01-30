
import React from 'react';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const links = [
    { view: View.HOME, label: 'HUB' },
    { view: View.ARCADE, label: 'ARCADE' },
    { view: View.LEADERS, label: 'LEADERS' },
    { view: View.SEASON, label: 'SEASON' },
    { view: View.AI_STRATEGY, label: 'STRATEGY' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center transform rotate-45 group-hover:rotate-180 transition-transform duration-500">
            <span className="text-slate-950 font-black -rotate-45 text-xl">RC</span>
          </div>
          <h1 className="font-orbitron text-xl font-black tracking-tighter neon-text text-cyan-400">
            RETRO <span className="text-slate-100">GAME CLUB</span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.view}
              onClick={() => onNavigate(link.view)}
              className={`font-orbitron text-xs tracking-widest font-bold transition-all duration-300 relative py-2 ${
                currentView === link.view ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
              {currentView === link.view && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em]">Live Status</span>
            <span className="text-xs text-green-400 font-mono animate-pulse">● CONNECTED</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
