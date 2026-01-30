import React, { useState, useEffect } from 'react';
import { scoreService } from '../services/scoreService';
import { ScoreEntry } from '../types';
import LeaderboardTable from '../components/LeaderboardTable';
import { Send, CheckCircle, Zap } from 'lucide-react';

const WeeklyLeaders: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    scoreService.checkWeeklyReset();
    setScores(scoreService.getWeeklyData().scores);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseInt(score);
    if (!name || isNaN(scoreNum) || scoreNum < 0) return;

    const updated = scoreService.addWeeklyScore(name.trim().toUpperCase(), scoreNum);
    setScores([...updated]);
    setName('');
    setScore('');
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-4xl font-black text-cyan-400 neon-text">WEEKLY LEADERS</h1>
        <div className="flex items-center justify-center space-x-4">
           <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
           <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">
             Active Event: <span className="text-white">TETRIS GB</span>
           </p>
           <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Entry Panel */}
        <div className="lg:col-span-4">
          <div className="glass p-8 rounded-[2rem] border-white/10 sticky top-28 shadow-xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Zap className="text-cyan-400" size={20} />
              </div>
              <h2 className="font-heading text-xl font-black text-white tracking-tight">POST SCORE</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-black text-slate-500 uppercase tracking-widest ml-1">Pilot Identity</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="EX: CYBER_PUNK"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-bold placeholder:text-slate-800"
                  maxLength={12}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-black text-slate-500 uppercase tracking-widest ml-1">Final Tally</label>
                <input 
                  type="number" 
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="000,000"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-bold placeholder:text-slate-800"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                UPLINK SCORE
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center font-bold animate-in fade-in zoom-in duration-300">
                <CheckCircle className="mr-2" size={16} />
                DATA UPLINK COMPLETE
              </div>
            )}
          </div>
        </div>

        {/* Board Panel */}
        <div className="lg:col-span-8">
          <LeaderboardTable scores={scores} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyLeaders;