
import React, { useEffect, useState } from 'react';
import { scoreService } from '../services/scoreService';
import { SeasonEntry } from '../types';
import { Trophy, Star, ShieldCheck } from 'lucide-react';

const SeasonRankings: React.FC = () => {
  const [seasonData, setSeasonData] = useState<SeasonEntry[]>([]);

  useEffect(() => {
    setSeasonData(scoreService.getSeasonData());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-4xl font-black text-cyan-400 neon-text">SEASON RANKINGS</h1>
        <p className="text-slate-400 uppercase tracking-widest text-sm">Accumulated Points across Weekly Battles</p>
      </div>

      {seasonData.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
            <ShieldCheck size={48} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-300">The Season Has Just Begun</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Points are awarded every Sunday midnight. Be in the top 3 of the current week's leaderboard to see your name here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {seasonData.map((entry, index) => (
            <div 
              key={entry.playerName} 
              className={`glass p-6 rounded-2xl border border-slate-800 flex items-center justify-between transition-all hover:translate-x-2 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' : ''
              }`}
            >
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  {index === 0 ? (
                    <Trophy className="text-yellow-400" size={32} />
                  ) : index === 1 ? (
                    <Trophy className="text-slate-300" size={28} />
                  ) : index === 2 ? (
                    <Trophy className="text-amber-600" size={24} />
                  ) : (
                    <span className="font-heading font-bold text-slate-600">#{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-black text-white">{entry.playerName}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-widest">
                    <Star size={12} className="text-cyan-500" />
                    <span>Elite Retro Gamer</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading text-3xl font-black text-cyan-400">{entry.points}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">TOTAL POINTS</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Points Legend */}
      <div className="glass p-8 rounded-2xl border-slate-800/50">
        <h4 className="font-heading text-sm font-black text-slate-400 mb-4 uppercase tracking-widest">Points Allocation</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-yellow-500/10 rounded-lg">
            <div className="text-yellow-400 font-black text-xl">100</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase">1st Place</div>
          </div>
          <div className="p-4 bg-slate-300/10 rounded-lg">
            <div className="text-slate-300 font-black text-xl">50</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase">2nd Place</div>
          </div>
          <div className="p-4 bg-amber-600/10 rounded-lg">
            <div className="text-amber-600 font-black text-xl">25</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase">3rd Place</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonRankings;
