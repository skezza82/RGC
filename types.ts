
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

export interface GitHubConfig {
  token: string;
  gistId: string;
  enabled: boolean;
}

export interface GlobalData {
  scores: ScoreEntry[];
  standings: SeasonPoints[];
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
