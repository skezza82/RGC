
import { ScoreEntry, SeasonPoints, GlobalData } from '../types.ts';

const FILE_NAME = 'retro_game_club_data.json';

export const fetchGlobalData = async (token: string, gistId: string): Promise<GlobalData | null> => {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch Gist');

    const gist = await response.json();
    const file = gist.files[FILE_NAME];
    
    if (!file) return { scores: [], standings: [] };
    
    return JSON.parse(file.content);
  } catch (error) {
    console.error('GitHub Fetch Error:', error);
    return null;
  }
};

export const updateGlobalData = async (token: string, gistId: string, data: GlobalData): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('GitHub Update Error:', error);
    return false;
  }
};
