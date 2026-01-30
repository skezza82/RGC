import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WeeklyLeaders from './pages/WeeklyLeaders';
import Arcade from './pages/Arcade';
import SeasonRankings from './pages/SeasonRankings';
import { scoreService } from './services/scoreService';

const App: React.FC = () => {
  useEffect(() => {
    // Check for weekly highscore reset on app mount
    scoreService.checkWeeklyReset();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weekly" element={<WeeklyLeaders />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/season" element={<SeasonRankings />} />
          </Routes>
        </main>
        
        <footer className="py-12 border-t border-slate-900 bg-slate-950 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <p className="font-heading text-sm font-bold text-slate-600 uppercase tracking-widest">
              © 2025 RETRO GAME CLUB • EST. 1984
            </p>
            <div className="flex justify-center space-x-6 text-slate-700">
              <span className="hover:text-cyan-500 transition-colors cursor-pointer">PRIVACY</span>
              <span className="hover:text-cyan-500 transition-colors cursor-pointer">TERMS</span>
              <span className="hover:text-cyan-500 transition-colors cursor-pointer">DISCORD</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;