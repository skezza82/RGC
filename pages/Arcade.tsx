import React, { useEffect, useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Gamepad2, Info, Keyboard } from 'lucide-react';

const Arcade: React.FC = () => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const img = await geminiService.generateTetrisBackground();
        if (img) setBgImage(img);
      } finally {
        setLoading(false);
      }
    };
    fetchBg();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="font-heading text-5xl md:text-6xl font-black text-cyan-400 neon-text tracking-tighter">THE ARCADE</h1>
        <p className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center justify-center space-x-2">
          <Gamepad2 size={16} className="text-pink-500" />
          <span>LOCKED & LOADED • RETRO CLASSICS</span>
        </p>
      </div>

      {/* Main Arcade Cabinet */}
      <div className="relative group max-w-5xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Game Screen */}
            <div className="lg:col-span-8 bg-black aspect-[4/3] relative">
              <iframe 
                src="https://www.retrogames.cc/embed/25597-tetris-world.html" 
                className="w-full h-full"
                frameBorder="no" 
                allowFullScreen={true} 
                scrolling="no"
                title="TETRIS GB"
              ></iframe>
            </div>
            
            {/* Game Info Sidebar */}
            <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center space-y-8 relative">
              {bgImage && (
                <div 
                  className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-110"
                  style={{ 
                    backgroundImage: `url(${bgImage})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-heading font-black rounded-full mb-4 inline-block border border-cyan-500/30">CURRENT: GAME OF THE WEEK</span>
                  <h2 className="font-heading text-4xl font-black text-white leading-none">TETRIS GB</h2>
                </div>

                <p className="text-slate-400 leading-relaxed text-base font-medium">
                  The legendary block-stacking puzzle. Clear lines, manage your stack, and survive the increasing speeds. This week, we're crowning the Tetris Master.
                </p>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Keyboard className="text-cyan-500" size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Arrows to Move • Z/X to Rotate</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Info className="text-pink-500" size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Score resets Sunday Midnight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Library */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
        {['Pac-Man', 'Galaga', 'Space Invaders', 'Donkey Kong'].map((game) => (
          <div key={game} className="glass group rounded-2xl p-6 border-white/5 opacity-40 hover:opacity-100 transition-all cursor-not-allowed">
            <div className="aspect-square bg-slate-950 rounded-xl mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Gamepad2 size={32} className="text-slate-800 group-hover:text-cyan-500 transition-colors" />
               <span className="absolute bottom-2 font-heading text-[8px] text-slate-700 font-bold uppercase tracking-widest">System Offline</span>
            </div>
            <h3 className="font-heading text-sm font-bold text-slate-500 group-hover:text-white transition-colors">{game.toUpperCase()}</h3>
            <p className="text-[10px] text-slate-700 mt-1 uppercase font-bold tracking-tighter">Coming Season 2</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Arcade;