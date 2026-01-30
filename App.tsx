
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.tsx';
import HighScoreBoard from './components/HighScoreBoard.tsx';
import SnakeGame from './components/SnakeGame.tsx';
import { View, ScoreEntry, SeasonPoints, GitHubConfig, GlobalData } from './types.ts';
import { STORAGE_KEYS, POINT_VALUES, GAMES } from './constants.tsx';
import { getGameStrategy } from './services/geminiService.ts';
import { fetchGlobalData, updateGlobalData } from './services/githubService.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [currentScores, setCurrentScores] = useState<ScoreEntry[]>([]);
  const [seasonStandings, setSeasonStandings] = useState<SeasonPoints[]>([]);
  const [aiStrategy, setAiStrategy] = useState<string>('');
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [username, setUsername] = useState<string>(() => localStorage.getItem('rv_username') || '');

  // GitHub Sync State
  const [ghConfig, setGhConfig] = useState<GitHubConfig>(() => {
    const saved = localStorage.getItem('rv_gh_config');
    return saved ? JSON.parse(saved) : { token: '', gistId: '', enabled: false };
  });

  // Manual input state
  const [inputName, setInputName] = useState('');
  const [inputScore, setInputScore] = useState('');
  
  // Track specific game in arcade
  const [activeArcadeGame, setActiveArcadeGame] = useState<string>('tetris-world');

  const getMostRecentSundayMidnight = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const performWeeklyReset = useCallback(async () => {
    const scores = currentScores;
    const standings = seasonStandings;
    
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const updatedStandings = [...standings];

    const awardPoints = (user: string, points: number) => {
      const idx = updatedStandings.findIndex(s => s.username === user);
      if (idx > -1) {
        updatedStandings[idx].points += points;
        updatedStandings[idx].wins += 1;
      } else {
        updatedStandings.push({ username: user, points, wins: 1 });
      }
    };

    if (sorted[0]) awardPoints(sorted[0].username, POINT_VALUES.FIRST);
    if (sorted[1]) awardPoints(sorted[1].username, POINT_VALUES.SECOND);
    if (sorted[2]) awardPoints(sorted[2].username, POINT_VALUES.THIRD);

    setCurrentScores([]);
    setSeasonStandings(updatedStandings);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SCORES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SEASON_STANDINGS, JSON.stringify(updatedStandings));
    localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, new Date().toISOString());

    if (ghConfig.enabled) {
      await pushToGlobal(updatedStandings, []);
    }
  }, [currentScores, seasonStandings, ghConfig]);

  const pushToGlobal = async (standings: SeasonPoints[], scores: ScoreEntry[]) => {
    if (!ghConfig.enabled || !ghConfig.token || !ghConfig.gistId) return;
    setIsSyncing(true);
    await updateGlobalData(ghConfig.token, ghConfig.gistId, { scores, standings });
    setIsSyncing(false);
  };

  const pullFromGlobal = async () => {
    if (!ghConfig.enabled || !ghConfig.token || !ghConfig.gistId) return;
    setIsSyncing(true);
    const data = await fetchGlobalData(ghConfig.token, ghConfig.gistId);
    if (data) {
      setCurrentScores(data.scores);
      setSeasonStandings(data.standings);
      localStorage.setItem(STORAGE_KEYS.CURRENT_SCORES, JSON.stringify(data.scores));
      localStorage.setItem(STORAGE_KEYS.SEASON_STANDINGS, JSON.stringify(data.standings));
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    const savedScores = localStorage.getItem(STORAGE_KEYS.CURRENT_SCORES);
    const savedSeason = localStorage.getItem(STORAGE_KEYS.SEASON_STANDINGS);
    const lastResetStr = localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);
    
    if (savedScores) setCurrentScores(JSON.parse(savedScores));
    if (savedSeason) setSeasonStandings(JSON.parse(savedSeason));

    const lastReset = lastResetStr ? new Date(lastResetStr) : null;
    const sundayMidnight = getMostRecentSundayMidnight();

    if (!lastReset || lastReset < sundayMidnight) {
      performWeeklyReset();
    }

    if (ghConfig.enabled) {
      pullFromGlobal();
    }
  }, [ghConfig.enabled]);

  const handleScoreSubmit = async (score: number, userOverride?: string) => {
    const targetUser = userOverride || username;
    if (!targetUser) return;
    const newEntry: ScoreEntry = { username: targetUser, score, date: new Date().toISOString() };
    const updated = [...currentScores, newEntry];
    setCurrentScores(updated);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SCORES, JSON.stringify(updated));

    if (ghConfig.enabled) {
      await pushToGlobal(seasonStandings, updated);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(inputScore);
    if (inputName && !isNaN(scoreVal)) {
      handleScoreSubmit(scoreVal, inputName);
      setInputName('');
      setInputScore('');
    }
  };

  const saveGhConfig = (config: GitHubConfig) => {
    setGhConfig(config);
    localStorage.setItem('rv_gh_config', JSON.stringify(config));
  };

  const fetchStrategy = async () => {
    setIsLoadingStrategy(true);
    const text = await getGameStrategy('TETRIS GB');
    setAiStrategy(text);
    setIsLoadingStrategy(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            <div className="lg:col-span-2 space-y-8">
              <section className="relative h-[440px] rounded-3xl overflow-hidden glass border border-cyan-500/20 group">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                   <div className="grid grid-cols-12 gap-1 w-full scale-150 rotate-12">
                      {[...Array(60)].map((_, i) => (
                        <div key={i} className={`h-8 w-8 border border-cyan-500/30 ${Math.random() > 0.8 ? 'bg-cyan-500/50' : ''}`}></div>
                      ))}
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 p-10 w-full z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">Active Protocol</span>
                  </div>
                  <h2 className="font-orbitron text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase italic drop-shadow-2xl">TETRIS GB</h2>
                  <p className="text-slate-300 max-w-xl mb-8 leading-relaxed text-sm md:text-base">The monochrome legend returns. Stack the blocks, clear the noise, and dominate the weekly scoreboard. Resetting every Sunday at 00:00 UTC.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentView(View.ARCADE)} className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-orbitron text-sm tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] active:scale-95">INITIALIZE SESSION</button>
                    <button onClick={() => setCurrentView(View.LEADERS)} className="px-8 py-4 glass text-white font-black font-orbitron text-sm tracking-widest rounded-xl transition-all hover:bg-white/10">VIEW BOARD</button>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-indigo-500/20 shadow-2xl">
                  <h3 className="font-orbitron font-bold text-indigo-400 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                    GITHUB UPLINK
                  </h3>
                  <div className="space-y-4">
                    {!ghConfig.enabled ? (
                      <div className="space-y-4">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Connect to a GitHub Gist to enable global synchronization for the leaderboard. This creates a shared terminal for like-minded gamers.</p>
                        <div className="space-y-2">
                          <input 
                            type="password" 
                            placeholder="Personal Access Token" 
                            className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs text-white focus:border-cyan-500 outline-none"
                            onChange={(e) => saveGhConfig({...ghConfig, token: e.target.value})}
                          />
                          <input 
                            type="text" 
                            placeholder="Gist ID" 
                            className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs text-white focus:border-cyan-500 outline-none"
                            onChange={(e) => saveGhConfig({...ghConfig, gistId: e.target.value})}
                          />
                        </div>
                        <button 
                          onClick={() => saveGhConfig({...ghConfig, enabled: true})}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black font-orbitron text-[10px] tracking-widest rounded-lg transition-all"
                        >
                          ACTIVATE UPLINK
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase italic">Connection Stable</span>
                          <button onClick={() => saveGhConfig({...ghConfig, enabled: false})} className="text-[9px] text-slate-500 hover:text-white underline uppercase">Disconnect</button>
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">NODE: {ghConfig.gistId}</div>
                        <button onClick={pullFromGlobal} className="w-full py-2 bg-white/5 border border-white/10 text-white font-bold text-[9px] tracking-widest rounded uppercase hover:bg-white/10 transition-all">Manual Sync</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h4 className="font-orbitron font-bold text-white mb-2 text-sm uppercase">Member Callsign</h4>
                  {username ? (
                    <div className="flex items-center gap-3">
                       <span className="text-emerald-400 font-mono font-bold uppercase tracking-tight">{username}</span>
                       <button onClick={() => { setUsername(''); localStorage.removeItem('rv_username'); }} className="text-[8px] text-slate-500 hover:text-white uppercase font-bold tracking-widest border border-white/10 px-2 py-1 rounded">Reset</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER CALLSIGN" 
                        className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded font-mono text-xs text-center text-white focus:border-cyan-500 outline-none uppercase"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setUsername(val);
                              localStorage.setItem('rv_username', val);
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <HighScoreBoard scores={currentScores} title="WEEKLY TOP" />
              <div className="glass p-6 rounded-2xl border border-indigo-500/20">
                <h4 className="font-orbitron font-bold text-indigo-400 text-[10px] tracking-widest mb-4 uppercase">Season Legends</h4>
                <div className="space-y-3">
                  {[...seasonStandings].sort((a,b) => b.points - a.points).slice(0, 3).map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-tighter">{i+1}. {s.username}</span>
                      <span className="font-mono text-indigo-400 font-bold">{s.points}P</span>
                    </div>
                  ))}
                  {seasonStandings.length === 0 && <p className="text-slate-600 text-[8px] uppercase tracking-widest text-center py-2">Archives Loading...</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case View.ARCADE:
        return (
          <div className="max-w-5xl mx-auto space-y-12 animate-slide-up">
            <div className="text-center space-y-3">
              <h2 className="font-orbitron text-4xl font-black text-white tracking-tighter uppercase italic">Club Arcade</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm">Secure terminal access granted. Note: Manual high-score submission required after sessions.</p>
            </div>
            <div className="flex flex-col items-center">
              {activeArcadeGame === 'tetris-world' ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative p-2 glass rounded-[2rem] border border-cyan-500/30 overflow-hidden shadow-2xl bg-black">
                     <iframe src="https://www.retrogames.cc/embed/25597-tetris-world.html" width="600" height="450" frameBorder="no" allowFullScreen={true} className="rounded-2xl" scrolling="no"></iframe>
                  </div>
                  <div className="mt-6 flex justify-center gap-6">
                    <button onClick={() => setCurrentView(View.LEADERS)} className="px-6 py-2 bg-white text-slate-950 font-black font-orbitron text-[10px] tracking-widest rounded-lg transition-all hover:bg-cyan-400">SUBMIT NEW SCORE</button>
                  </div>
                </div>
              ) : (
                <SnakeGame onGameOver={handleScoreSubmit} />
              )}
            </div>
          </div>
        );

      case View.LEADERS:
        return (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up">
            <div className="space-y-8">
              <div>
                <h2 className="font-orbitron text-4xl font-black text-white tracking-tighter mb-2">WEEKLY LEADERS</h2>
                <p className="text-slate-500 text-sm italic tracking-tight">Active Challenge: <span className="text-cyan-500 font-bold uppercase">TETRIS GB</span></p>
                {isSyncing && (
                  <div className="mt-4 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Synchronizing Data Packets...</span>
                  </div>
                )}
              </div>
              <HighScoreBoard scores={currentScores} title="VERIFIED LOGS" />
            </div>
            <div className="space-y-8">
              <div className="glass p-8 rounded-3xl border border-cyan-500/20 shadow-2xl">
                <h3 className="font-orbitron font-bold text-cyan-400 mb-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg></div>
                   UPLINK SCORE
                </h3>
                <form onSubmit={handleManualSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Member Callsign</label>
                    <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="ENTER NAME..." required className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl font-mono text-white focus:border-cyan-500 outline-none transition-all uppercase" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Verified Score</label>
                    <input type="number" value={inputScore} onChange={(e) => setInputScore(e.target.value)} placeholder="000000" required className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl font-mono text-white focus:border-cyan-500 outline-none transition-all" />
                  </div>
                  <button type="submit" disabled={isSyncing} className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black font-orbitron text-sm tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95 uppercase">
                    {isSyncing ? 'TRANSMITTING...' : 'Transmit Data'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case View.SEASON:
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
            <div className="text-center space-y-2">
              <h2 className="font-orbitron text-4xl font-black text-white tracking-tighter uppercase italic">Club Standings</h2>
              <p className="text-cyan-500 font-bold uppercase tracking-[0.3em] text-[10px]">Season Alpha // Global Ranking</p>
            </div>
            <div className="glass rounded-3xl overflow-hidden border border-white/5">
              <div className="p-10">
                <table className="w-full">
                   <thead>
                     <tr className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                       <th className="pb-4 text-left font-black">Member</th>
                       <th className="pb-4 text-center font-black">Weeks Won</th>
                       <th className="pb-4 text-right font-black">Total Pts</th>
                     </tr>
                   </thead>
                   <tbody>
                     {[...seasonStandings].sort((a,b) => b.points - a.points).map((player, idx) => (
                       <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                         <td className="py-8 flex items-center gap-6">
                           <span className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-mono font-black text-slate-400">{idx + 1}</span>
                           <span className="font-orbitron font-black text-2xl text-white tracking-tight uppercase italic">{player.username}</span>
                         </td>
                         <td className="py-8 text-center"><span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-mono font-bold uppercase text-xs">{player.wins}</span></td>
                         <td className="py-8 text-right"><span className="text-4xl font-mono font-black text-cyan-400 tabular-nums">{player.points}</span></td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case View.AI_STRATEGY:
        return (
          <div className="max-w-3xl mx-auto space-y-10 animate-slide-up">
            <div className="text-center">
              <h2 className="font-orbitron text-3xl font-black text-white tracking-tighter mb-4 uppercase italic">Oracle Terminal</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">AI analysis for: <span className="text-cyan-400 font-bold uppercase">TETRIS GB</span>. Pattern extraction active.</p>
            </div>
            <div className="glass rounded-3xl p-12 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
              {!aiStrategy ? (
                <div className="flex flex-col items-center gap-10 py-12">
                   <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                   <button onClick={fetchStrategy} className="px-12 py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-orbitron text-sm tracking-widest rounded-2xl">GET STRATEGY</button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="font-mono text-slate-300 leading-relaxed text-sm whitespace-pre-wrap border-l-2 border-cyan-500 pl-6 py-2">{aiStrategy}</div>
                  <button onClick={() => setAiStrategy('')} className="text-[10px] text-cyan-500 hover:text-cyan-400 font-black uppercase tracking-widest underline underline-offset-8">New Query</button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-cyan-500/30 flex flex-col">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">{renderContent()}</main>
      <footer className="glass border-t border-white/5 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center font-orbitron font-black text-cyan-400 shadow-xl">RC</div>
             <div>
                <p className="text-[11px] text-slate-200 font-black uppercase tracking-widest italic">RETRO GAME CLUB</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Community Central Node</p>
             </div>
          </div>
          <div className="flex gap-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <button onClick={() => setCurrentView(View.HOME)} className="hover:text-cyan-400 transition-colors underline decoration-slate-800 uppercase">Archive Logs</button>
            <a href="#" className="hover:text-cyan-400 transition-colors underline decoration-slate-800">Support</a>
          </div>
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">© 20XX RGC // V.2.4.0 (GITHUB-SYNC)</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
