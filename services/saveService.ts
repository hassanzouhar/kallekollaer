import { Team, GameState, GameView, ScheduledMatch, SeasonPhase, PlayoffSeries, MatchResult, Scout, ScoutingReport, JobOffer } from '../types';

const SAVE_KEY = 'iskalde_kaeller_save_v1';
const AUTOSAVE_KEY = 'iskalde_kaeller_autosave_v1';

export interface SaveGame {
  // Core Game State
  gameState: GameState;
  view: GameView;

  // Career State
  userTeamId: string;
  dreamTeamId: string;
  seasonCount: number;
  jobOffers: JobOffer[];

  // Season State
  teams: Team[];
  schedule: ScheduledMatch[];
  currentWeek: number;
  phase: SeasonPhase;
  playoffSeries: PlayoffSeries[];

  // Match State
  lastMatchResult: MatchResult | null;
  advice: string;
  adviceCache: {[key: number]: string};

  // Economy & Scouting
  hiredScouts: Scout[];
  scoutingReports: ScoutingReport[];
  dugnadCooldown: boolean;
  newsFeed: string[];

  // Metadata
  savedAt: string;
  version: string;
}

/**
 * Save game state to localStorage
 */
export const saveGame = (state: Omit<SaveGame, 'savedAt' | 'version'>, isAutoSave = false): boolean => {
  try {
    const saveData: SaveGame = {
      ...state,
      savedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const serialized = JSON.stringify(saveData);
    const key = isAutoSave ? AUTOSAVE_KEY : SAVE_KEY;

    localStorage.setItem(key, serialized);
    console.log(`[SaveService] Game ${isAutoSave ? 'auto-' : ''}saved successfully (${(serialized.length / 1024).toFixed(2)}KB)`);
    return true;
  } catch (error) {
    console.error('[SaveService] Failed to save game:', error);
    return false;
  }
};

/**
 * Load game state from localStorage
 */
export const loadGame = (loadAutoSave = false): SaveGame | null => {
  try {
    const key = loadAutoSave ? AUTOSAVE_KEY : SAVE_KEY;
    const saved = localStorage.getItem(key);

    if (!saved) {
      console.log('[SaveService] No save game found');
      return null;
    }

    const parsed: SaveGame = JSON.parse(saved);
    console.log(`[SaveService] Game loaded from ${parsed.savedAt}`);
    return parsed;
  } catch (error) {
    console.error('[SaveService] Failed to load game:', error);
    return null;
  }
};

/**
 * Check if a save game exists
 */
export const hasSaveGame = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null || localStorage.getItem(AUTOSAVE_KEY) !== null;
};

/**
 * Get save game metadata without loading full state
 */
export const getSaveMetadata = (): { savedAt: string; seasonCount: number; teamName: string } | null => {
  try {
    const saved = localStorage.getItem(SAVE_KEY) || localStorage.getItem(AUTOSAVE_KEY);
    if (!saved) return null;

    const parsed: SaveGame = JSON.parse(saved);
    const userTeam = parsed.teams.find(t => t.id === parsed.userTeamId);

    return {
      savedAt: parsed.savedAt,
      seasonCount: parsed.seasonCount,
      teamName: userTeam?.name || 'Unknown Team'
    };
  } catch (error) {
    console.error('[SaveService] Failed to get save metadata:', error);
    return null;
  }
};

/**
 * Delete save game
 */
export const deleteSaveGame = (): void => {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(AUTOSAVE_KEY);
  console.log('[SaveService] Save game deleted');
};

/**
 * Export save game as downloadable JSON file
 */
export const exportSaveGame = (): void => {
  const saveData = loadGame();
  if (!saveData) {
    alert('No save game to export');
    return;
  }

  const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `iskalde_kaeller_save_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);

  console.log('[SaveService] Save game exported');
};

/**
 * Import save game from JSON file
 */
export const importSaveGame = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed: SaveGame = JSON.parse(content);

        // Basic validation
        if (!parsed.gameState || !parsed.teams || !parsed.userTeamId) {
          alert('Invalid save file format');
          resolve(false);
          return;
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
        console.log('[SaveService] Save game imported successfully');
        resolve(true);
      } catch (error) {
        console.error('[SaveService] Failed to import save:', error);
        alert('Failed to import save file');
        resolve(false);
      }
    };

    reader.onerror = () => {
      alert('Failed to read file');
      resolve(false);
    };

    reader.readAsText(file);
  });
};
