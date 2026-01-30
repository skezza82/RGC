
import React from 'react';
import { ScoreEntry } from '../types.ts';

interface HighScoreBoardProps {
  scores: ScoreEntry[];
  title: string;
}

const HighScoreBoard: React.FC<HighScoreBoardProps> = ({ scores, title }) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="glass rounded-2xl overflow-hidden border border-cyan-500/10 h-full">
      <div className="bg-cyan-500/10 p-4 border-b border-cyan-500/20 flex justify-between items-center">
        <h3 className="font-orbitron font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
          {title}
        </h3>
        <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Live Updates</span>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[400px]">
        {sortedScores.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="pb-3 font-medium">Rank</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((entry, idx) => (
                <tr key={idx} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="py-4 font-orbitron font-bold text-slate-400">
                    {idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-100 font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                        {entry.username}
                      </span>
                      <span className="text-[10px] text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-mono text-cyan-400 font-bold text-lg tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-dashed border-slate-700 rounded-full animate-spin"></div>
            <p className="font-orbitron text-xs tracking-widest">WAITING FOR TRANSMISSIONS...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighScoreBoard;
