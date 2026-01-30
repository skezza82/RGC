
import React from 'react';
import { ScoreEntry } from '../types';
import { Medal } from 'lucide-react';

interface Props {
  scores: ScoreEntry[];
}

const LeaderboardTable: React.FC<Props> = ({ scores }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-heading font-bold text-cyan-500 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-4 text-left text-xs font-heading font-bold text-cyan-500 uppercase tracking-wider">Player</th>
            <th className="px-6 py-4 text-right text-xs font-heading font-bold text-cyan-500 uppercase tracking-wider">Score</th>
            <th className="px-6 py-4 text-right text-xs font-heading font-bold text-cyan-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {scores.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                No scores submitted yet for this week.
              </td>
            </tr>
          ) : (
            scores.map((entry, index) => (
              <tr key={entry.id} className="hover:bg-cyan-500/5 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 ? (
                      <Medal className={`${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-amber-600'} mr-2`} size={20} />
                    ) : null}
                    <span className={`font-heading font-bold ${index < 3 ? 'text-lg' : 'text-slate-400'}`}>
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {entry.playerName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-heading font-bold text-slate-200">
                  {entry.score.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
