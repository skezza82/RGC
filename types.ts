
export interface ScoreEntry {
  username: string;
  score: number;
  date: string;
}

export interface SeasonPoints {
  username: string;
  points: number;
  wins: number;
}

export interface GameInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'internal' | 'external';
}

export enum View {
  HOME = 'HOME',
  ARCADE = 'ARCADE',
  LEADERS = 'LEADERS',
  SEASON = 'SEASON',
  AI_STRATEGY = 'AI_STRATEGY'
}
