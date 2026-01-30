
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Trophy, Clock, Gamepad2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl neon-border mx-4 mt-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/2/1600/900" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 scale-110 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase neon-text">
            GAME OF <span className="text-cyan-400">THE WEEK</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 font-medium">
            Every week we pick a classic title. Play, compete, and climb the season rankings.
            The scoreboard resets every Sunday at midnight.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/arcade" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-bold rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95">
              <Play fill="currentColor" size={20} />
              <span>PLAY TETRIS GB</span>
            </Link>
            <Link to="/weekly" className="px-8 py-4 border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-heading font-bold rounded-lg flex items-center space-x-2 transition-all">
              <Trophy size={20} />
              <span>VIEW LEADERBOARD</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {[
          { icon: <Clock className="text-cyan-400" />, title: "Weekly Reset", desc: "Every Sunday at 00:00 UTC, the board is wiped and points are awarded to the top 3." },
          { icon: <Trophy className="text-yellow-400" />, title: "Season Points", desc: "1st gets 100pts, 2nd gets 50pts, and 3rd gets 25pts towards the grand season leaderboard." },
          { icon: <Gamepad2 className="text-pink-500" />, title: "The Arcade", desc: "Classic retro games playable directly in your browser. No downloads, just pure skill." },
        ].map((item, i) => (
          <div key={i} className="glass p-8 rounded-2xl border-cyan-500/10 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {/* Fix: use React.ReactElement<any> to permit cloning with Lucide icon specific props like size */}
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h3 className="font-heading text-xl font-bold mb-2 text-white">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
