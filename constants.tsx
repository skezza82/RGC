
import { GameInfo } from './types.ts';

export const GAMES: GameInfo[] = [
  {
    id: 'tetris-world',
    title: 'TETRIS GB',
    description: 'The definitive monochrome classic. Master the art of the perfect clear.',
    thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=400&h=300',
    type: 'external'
  },
  {
    id: 'snake-cyber',
    title: 'Neon Snake',
    description: 'A futuristic take on the classic arcade game. Collect neon pulses to grow.',
    thumbnail: 'https://picsum.photos/seed/snake/400/300',
    type: 'internal'
  },
  {
    id: 'pong-pulse',
    title: 'Pulse Pong',
    description: 'Classic table tennis reimagined with kinetic energy and glow effects.',
    thumbnail: 'https://picsum.photos/seed/pong/400/300',
    type: 'internal'
  }
];

export const POINT_VALUES = {
  FIRST: 100,
  SECOND: 50,
  THIRD: 25
};

export const STORAGE_KEYS = {
  CURRENT_SCORES: 'retro_vault_current_scores',
  SEASON_STANDINGS: 'retro_vault_season_standings',
  LAST_RESET_DATE: 'retro_vault_last_reset'
};
