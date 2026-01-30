
import { ScoreEntry, SeasonEntry, WeeklyData } from '../types';

const STORAGE_KEY_WEEKLY = 'retro_club_weekly';
const STORAGE_KEY_SEASON = 'retro_club_season';

export const getNextSundayMidnight = (now: Date): number => {
  const result = new Date(now);
  result.setDate(now.getDate() + (7 - now.getDay()));
  result.setHours(0, 0, 0, 0);
  return result.getTime();
};

export const scoreService = {
  getWeeklyData: (): WeeklyData => {
    const raw = localStorage.getItem(STORAGE_KEY_WEEKLY);
    if (!raw) {
      return {
        gameName: "TETRIS GB",
        scores: [],
        lastReset: new Date().getTime()
      };
    }
    return JSON.parse(raw);
  },

  getSeasonData: (): SeasonEntry[] => {
    const raw = localStorage.getItem(STORAGE_KEY_SEASON);
    return raw ? JSON.parse(raw) : [];
  },

  addWeeklyScore: (name: string, score: number) => {
    const data = scoreService.getWeeklyData();
    const newEntry: ScoreEntry = {
      id: Math.random().toString(36).substr(2, 9),
      playerName: name,
      score,
      timestamp: Date.now()
    };
    data.scores.push(newEntry);
    data.scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY_WEEKLY, JSON.stringify(data));
    return data.scores;
  },

  checkWeeklyReset: () => {
    const data = scoreService.getWeeklyData();
    const now = new Date();
    
    // Find previous Sunday midnight
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - now.getDay());
    lastSunday.setHours(0, 0, 0, 0);
    const lastSundayTime = lastSunday.getTime();

    // If we haven't reset since the last sunday passed
    if (data.lastReset < lastSundayTime) {
      // 1. Calculate Season Points
      const top3 = data.scores.slice(0, 3);
      const seasonData = scoreService.getSeasonData();
      
      const pointMap = [100, 50, 25];
      top3.forEach((entry, index) => {
        const existing = seasonData.find(s => s.playerName === entry.playerName);
        if (existing) {
          existing.points += pointMap[index];
        } else {
          seasonData.push({ playerName: entry.playerName, points: pointMap[index] });
        }
      });
      
      seasonData.sort((a, b) => b.points - a.points);
      localStorage.setItem(STORAGE_KEY_SEASON, JSON.stringify(seasonData));

      // 2. Reset Weekly
      const newData: WeeklyData = {
        gameName: "TETRIS GB",
        scores: [],
        lastReset: Date.now()
      };
      localStorage.setItem(STORAGE_KEY_WEEKLY, JSON.stringify(newData));
      return true;
    }
    return false;
  }
};
