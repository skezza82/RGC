
export interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  timestamp: number;
}

export interface SeasonEntry {
  playerName: string;
  points: number;
}

export interface WeeklyData {
  gameName: string;
  scores: ScoreEntry[];
  lastReset: number; // timestamp
}

export interface Game {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl?: string;
}
